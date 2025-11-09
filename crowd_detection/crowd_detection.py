import cv2
import numpy as np
import requests
import time
from datetime import datetime
from pathlib import Path

class CrowdDetector:
    def __init__(self, backend_url="http://localhost:8080"):
        self.backend_url = backend_url
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        self.person_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_fullbody.xml'
        )
        self.cap = None
        self.is_running = False
        
    def start_webcam(self):
        """Initialize webcam"""
        self.cap = cv2.VideoCapture(0)
        if not self.cap.isOpened():
            raise Exception("Cannot open webcam")
        print("✓ Webcam started")
    
    def detect_people(self, frame):
        """Detect people in frame using cascade classifiers"""
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        
        # Detect bodies
        bodies = self.person_cascade.detectMultiScale(gray, 1.3, 5)
        
        # Combine and deduplicate detections
        detections = np.vstack([faces, bodies]) if len(bodies) > 0 else faces
        
        # Remove duplicates (if face and body overlap)
        unique_detections = self._remove_duplicates(detections)
        
        return len(unique_detections), unique_detections
    
    def _remove_duplicates(self, detections):
        """Remove duplicate detections that are too close"""
        if len(detections) == 0:
            return detections
        
        unique = []
        for (x, y, w, h) in detections:
            is_duplicate = False
            for (ux, uy, uw, uh) in unique:
                # Check if boxes overlap significantly
                if (x < ux + uw and x + w > ux and 
                    y < uy + uh and y + h > uy):
                    is_duplicate = True
                    break
            if not is_duplicate:
                unique.append((x, y, w, h))
        
        return np.array(unique)
    
    def send_to_backend(self, crowd_count, confidence):
        """Send crowd data to backend"""
        try:
            params = {
                'crowdCount': crowd_count,
                'confidence': confidence
            }
            response = requests.post(
                f"{self.backend_url}/api/crowd-detection/save",
                params=params,
                timeout=5
            )
            if response.status_code == 200:
                print(f"✓ Sent: {crowd_count} people detected (confidence: {confidence:.2f}%)")
            else:
                print(f"✗ Backend error: {response.status_code}")
        except Exception as e:
            print(f"✗ Connection error: {e}")
    
    def draw_detections(self, frame, detections):
        """Draw rectangles around detected people"""
        for (x, y, w, h) in detections:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        
        return frame
    
    def run(self, send_interval=10):
        """Main detection loop"""
        self.start_webcam()
        self.is_running = True
        last_send_time = time.time()
        
        print("✓ Crowd detection started...")
        print("Press 'q' to exit")
        
        try:
            while self.is_running:
                ret, frame = self.cap.read()
                if not ret:
                    print("✗ Failed to read frame")
                    break
                
                # Resize for faster processing
                frame = cv2.resize(frame, (640, 480))
                
                # Detect people
                crowd_count, detections = self.detect_people(frame)
                
                # Calculate confidence (0-100)
                confidence = min(100, crowd_count * 10)
                
                # Draw detections
                frame = self.draw_detections(frame, detections)
                
                # Add info text
                text = f"People: {crowd_count} | Confidence: {confidence:.1f}%"
                cv2.putText(frame, text, (10, 30), 
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                
                # Show frame
                cv2.imshow('Crowd Detection', frame)
                
                # Send data at intervals
                current_time = time.time()
                if current_time - last_send_time >= send_interval:
                    self.send_to_backend(crowd_count, confidence)
                    last_send_time = current_time
                
                # Exit on 'q' key
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
        
        except KeyboardInterrupt:
            print("\n✓ Stopped by user")
        finally:
            self.stop()
    
    def stop(self):
        """Stop detection"""
        self.is_running = False
        if self.cap:
            self.cap.release()
        cv2.destroyAllWindows()
        print("✓ Crowd detection stopped")

# Main execution
if __name__ == "__main__":
    detector = CrowdDetector(backend_url="http://localhost:8080")
    detector.run(send_interval=10)  # Send data every 10 seconds
