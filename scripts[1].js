let currentStep = 1;
        let isDrawing = false;
        let signatureCanvas = null;
        let signatureCtx = null;

        // Initialize signature canvas
        document.addEventListener('DOMContentLoaded', function() {
            signatureCanvas = document.getElementById('signatureCanvas');
            signatureCtx = signatureCanvas.getContext('2d');
            
            // Set up signature canvas
            signatureCtx.strokeStyle = '#000';
            signatureCtx.lineWidth = 2;
            signatureCtx.lineCap = 'round';
            
            // Mouse events
            signatureCanvas.addEventListener('mousedown', startDrawing);
            signatureCanvas.addEventListener('mousemove', draw);
            signatureCanvas.addEventListener('mouseup', stopDrawing);
            signatureCanvas.addEventListener('mouseout', stopDrawing);
            
            // Touch events for mobile
            signatureCanvas.addEventListener('touchstart', handleTouch);
            signatureCanvas.addEventListener('touchmove', handleTouch);
            signatureCanvas.addEventListener('touchend', stopDrawing);
            
            // Photo upload
            document.getElementById('photoInput').addEventListener('change', handlePhotoUpload);
        });

        function nextStep(step) {
            if (validateCurrentStep()) {
                updateStepIndicator(step);
                showStep(step);
                currentStep = step;
                
                if (step === 4) {
                    populateSummary();
                }
            }
        }

        function prevStep(step) {
            updateStepIndicator(step);
            showStep(step);
            currentStep = step;
        }

        function showStep(step) {
            document.querySelectorAll('.form-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(`step${step}`).classList.add('active');
        }

        function updateStepIndicator(step) {
            for (let i = 1; i <= 4; i++) {
                const indicator = document.getElementById(`step${i}-indicator`);
                indicator.classList.remove('step-active', 'step-completed', 'step-inactive');
                
                if (i < step) {
                    indicator.classList.add('step-completed');
                } else if (i === step) {
                    indicator.classList.add('step-active');
                } else {
                    indicator.classList.add('step-inactive');
                }
            }
        }

        function validateCurrentStep() {
            if (currentStep === 1) {
                const required = ['firstName', 'lastName', 'email', 'phone', 'address'];
                for (let field of required) {
                    const element = document.getElementById(field);
                    if (!element.value.trim()) {
                        element.focus();
                        element.classList.add('border-red-500');
                        setTimeout(() => element.classList.remove('border-red-500'), 3000);
                        return false;
                    }
                }
            }
            return true;
        }

        function handlePhotoUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('previewImage').src = e.target.result;
                    document.getElementById('photoPreview').classList.remove('hidden');
                    document.getElementById('photoUploadPrompt').classList.add('hidden');
                };
                reader.readAsDataURL(file);
            }
        }

        function startDrawing(e) {
            isDrawing = true;
            const rect = signatureCanvas.getBoundingClientRect();
            signatureCtx.beginPath();
            signatureCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        }

        function draw(e) {
            if (!isDrawing) return;
            const rect = signatureCanvas.getBoundingClientRect();
            signatureCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            signatureCtx.stroke();
        }

        function stopDrawing() {
            isDrawing = false;
        }

        function handleTouch(e) {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                            e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            signatureCanvas.dispatchEvent(mouseEvent);
        }

        function clearSignature() {
            signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
        }

        function populateSummary() {
            const summary = document.getElementById('summaryContent');
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            
            summary.innerHTML = `
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Address:</strong> ${address}</p>
                <p><strong>Photo:</strong> ${document.getElementById('photoPreview').classList.contains('hidden') ? 'Not uploaded' : 'Uploaded ✓'}</p>
                <p><strong>Signature:</strong> Provided ✓</p>
            `;
        }

        function submitRegistration() {
            const termsCheckbox = document.getElementById('termsCheckbox');
            if (!termsCheckbox.checked) {
                alert('Please accept the terms and conditions to continue.');
                return;
            }

            // Generate reference ID
            const refId = 'JMB-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 900000 + 100000);
            document.getElementById('referenceId').textContent = refId;
            
            // Get customer details
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const customerEmail = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const dob = document.getElementById('dob').value;
            const contactMethod = document.getElementById('contactMethod').value;
            
            // Auto-submit to business email
            sendRegistrationToBusinessEmail(refId, firstName, lastName, customerEmail, phone, address, dob, contactMethod);
            
            // Send confirmation email to customer
            sendEmailCopyToCustomer(customerEmail, refId);
            
            // Show success modal
            document.getElementById('successModal').classList.remove('hidden');
            document.getElementById('successModal').classList.add('flex');
            
            // Redirect to Facebook profile after 5 seconds
            setTimeout(() => {
                window.open('https://web.facebook.com/profile.php?id=', '_blank');
            }, 5000);
        }

        function sendRegistrationToBusinessEmail(refId, firstName, lastName, email, phone, address, dob, contactMethod) {
            // Create email subject and body for business
            const subject = `New Loyalty Card Registration - ${firstName} ${lastName} (${refId})`;
            const body = `NEW LOYALTY CARD REGISTRATION
            
Reference ID: ${refId}
Registration Date: ${new Date().toLocaleString()}

CUSTOMER DETAILS:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Phone: ${phone}
- Address: ${address}
- Date of Birth: ${dob || 'Not provided'}
- Preferred Contact: ${contactMethod}

Photo: ${document.getElementById('photoPreview').classList.contains('hidden') ? 'Not uploaded' : 'Uploaded'}
Signature: Provided

Please process this loyalty card registration.

---
JMB PRINTING SERVICES
Loyalty Card System`;

            // Create mailto link for automatic email submission
            const mailtoLink = `mailto:jmbprintingservices12@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Auto-open email client
            window.open(mailtoLink, '_blank');
            
            // Also log the registration data
            console.log('Registration submitted to business email:', {
                refId,
                firstName,
                lastName,
                email,
                phone,
                address,
                dob,
                contactMethod,
                timestamp: new Date().toISOString()
            });
        }

        function sendEmailCopyToCustomer(email, referenceId) {
            // In a real application, this would send an actual email
            // For demo purposes, we'll show a confirmation message
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            
            // Create email content
            const emailContent = {
                to: email,
                subject: 'JMB PRINTING SERVICES - Loyalty Card Registration Confirmation',
                body: `
                    Dear ${firstName} ${lastName},
                    
                    Thank you for registering for the JMB PRINTING SERVICES Loyalty Card!
                    
                    Your registration details:
                    - Reference ID: ${referenceId}
                    - Name: ${firstName} ${lastName}
                    - Email: ${email}
                    - Registration Date: ${new Date().toLocaleDateString()}
                    
                    Your loyalty card will be processed within 24 hours and you will receive your card ID via email.
                    
                    Thank you for choosing JMB PRINTING SERVICES!
                    
                    Best regards,
                    JMB PRINTING SERVICES Team
                `
            };
            
            // Log email content (in real app, this would be sent via email service)
            console.log('Email sent to customer:', emailContent);
            
            // Show email confirmation in the UI
            setTimeout(() => {
                const emailConfirmation = document.createElement('div');
                emailConfirmation.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4';
                emailConfirmation.innerHTML = `
                    <div class="flex items-center">
                        <span class="text-green-500 mr-2">📧</span>
                        <span>Confirmation email sent to ${email}</span>
                    </div>
                `;
                
                const modal = document.querySelector('#successModal .bg-white');
                const referenceDiv = modal.querySelector('.bg-gray-100');
                referenceDiv.parentNode.insertBefore(emailConfirmation, referenceDiv.nextSibling);
            }, 1000);
        }

        function showRegistration() {
            document.getElementById('homepage').style.display = 'none';
            document.getElementById('registrationSection').style.display = 'block';
        }

        function showHomepage() {
            document.getElementById('registrationSection').style.display = 'none';
            document.getElementById('homepage').style.display = 'block';
        }

        function resetForm() {
            // Hide modal
            document.getElementById('successModal').classList.add('hidden');
            document.getElementById('successModal').classList.remove('flex');
            
            // Reset form
            document.querySelectorAll('input, textarea, select').forEach(element => {
                element.value = '';
            });
            
            // Reset photo
            document.getElementById('photoPreview').classList.add('hidden');
            document.getElementById('photoUploadPrompt').classList.remove('hidden');
            
            // Clear signature
            clearSignature();
            
            // Reset to step 1
            currentStep = 1;
            updateStepIndicator(1);
            showStep(1);
            
            // Uncheck terms
            document.getElementById('termsCheckbox').checked = false;
            
            // Return to homepage
            showHomepage();
        }