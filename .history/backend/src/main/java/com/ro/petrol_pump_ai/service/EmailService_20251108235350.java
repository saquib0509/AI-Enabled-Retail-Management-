package com.ro.petrol_pump_ai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Send simple text email
     */
    @Value("${app.sender.name}")
    private String senderName;
    
    public boolean sendSimpleEmail(String toEmail, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom("saquib.test3@gmail.com", senderName); // Add sender name here
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body);
            
            mailSender.send(message);
            return true;
        } catch (Exception e) {
            logger.error("Failed to send email: " + e.getMessage());
            return false;
        }
    }
    


    /**
     * Send email to multiple recipients
     */
    public boolean sendEmailToMultiple(String[] toEmails, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmails);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("your-email@gmail.com");

            mailSender.send(message);
            logger.info("Email sent to: " + String.join(", ", toEmails));
            return true;
        } catch (Exception e) {
            logger.error("Failed to send email: " + e.getMessage());
            return false;
        }
    }
}
