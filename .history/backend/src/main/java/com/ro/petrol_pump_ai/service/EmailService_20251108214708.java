package com.ro.petrol_pump_ai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Send simple text email
     */
    public boolean sendSimpleEmail(String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("your-email@gmail.com");

            mailSender.send(message);
            logger.info("✓ Email sent to: " + toEmail);
            return true;
        } catch (Exception e) {
            logger.error("❌ Failed to send email: " + e.getMessage());
            return false;
        }
    }

    

    public void sendSimpleEmail(String to, String subject, String body) {
        emailService.sendSimpleEmail(to, subject, body);
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
            logger.info("✓ Email sent to: " + String.join(", ", toEmails));
            return true;
        } catch (Exception e) {
            logger.error("❌ Failed to send email: " + e.getMessage());
            return false;
        }
    }
}
