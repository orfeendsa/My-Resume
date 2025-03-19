document.addEventListener('DOMContentLoaded', function() {
    // Add print functionality
    const addPrintButton = () => {
        const printBtn = document.createElement('button');
        printBtn.innerText = 'Print Resume';
        printBtn.className = 'print-btn';
        printBtn.addEventListener('click', () => {
            // Before printing, ensure all content is visible
            document.querySelectorAll('section').forEach(section => {
                section.classList.remove('hidden');
                section.classList.add('fade-in');
            });
            
            // Add page breaks if needed based on content length
            const keyAchievements = document.querySelector('.key-achievements');
            if (keyAchievements && keyAchievements.offsetTop > 1000) {
                keyAchievements.classList.add('page-break');
            }
            
            // Small delay to ensure styles are applied
            setTimeout(() => {
                window.print();
            }, 100);
        });
        
        const container = document.querySelector('.container');
        container.insertAdjacentElement('beforebegin', printBtn);
    };
    
    // Add animation to sections when scrolling
    const addScrollAnimation = () => {
        const sections = document.querySelectorAll('section');
        
        const fadeInOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const fadeInObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, fadeInOptions);
        
        sections.forEach(section => {
            section.classList.add('hidden');
            fadeInObserver.observe(section);
        });
    };
    
    // Add dynamic phone link
    const enhanceContactInfo = () => {
        const phoneElement = document.querySelector('.contact-info span:nth-child(2)');
        if (phoneElement) {
            const phoneText = phoneElement.innerText;
            const phoneNumber = phoneText.replace(/[^0-9+]/g, '');
            if (phoneNumber) {
                phoneElement.innerHTML = `<i class="fas fa-phone"></i> <a href="tel:${phoneNumber}">${phoneText.replace('Call/SMS/WhatsApp: ', '')}</a>`;
            }
        }
    };
    
    // Handle profile image loading and fallback
    const handleProfileImage = () => {
        const profileImg = document.querySelector('.profile-photo img');
        if (profileImg) {
            // Add loading class
            profileImg.parentElement.classList.add('loading');
            
            // Try to fetch the image and store it locally
            fetch(profileImg.src)
                .then(response => {
                    // Check if we got the image successfully
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob();
                })
                .then(blob => {
                    // Create a URL for the blob and use it for the image
                    const objectURL = URL.createObjectURL(blob);
                    profileImg.src = objectURL;
                    
                    // Try to save a local copy for future use
                    try {
                        // This just sets up the local file path, it doesn't actually save the file
                        // The actual saving would require server-side code
                        const fallbackPath = profileImg.getAttribute('data-fallback');
                        if (fallbackPath) {
                            console.log('Image loaded successfully. Local path would be:', fallbackPath);
                        }
                    } catch (err) {
                        console.warn('Could not set up local file saving:', err);
                    }
                })
                .catch(error => {
                    console.error('Error fetching the image:', error);
                    
                    // Try the fallback image if available
                    const fallbackPath = profileImg.getAttribute('data-fallback');
                    if (fallbackPath) {
                        profileImg.src = fallbackPath;
                        // If fallback also fails, show initials
                        profileImg.onerror = () => useInitials(profileImg);
                    } else {
                        useInitials(profileImg);
                    }
                });
            
            // Handle successful load
            profileImg.addEventListener('load', () => {
                profileImg.parentElement.classList.remove('loading');
                profileImg.parentElement.classList.add('loaded');
            });
            
            // Handle error loading image
            profileImg.addEventListener('error', () => {
                // Try the fallback image if available
                const fallbackPath = profileImg.getAttribute('data-fallback');
                if (fallbackPath && profileImg.src !== fallbackPath) {
                    profileImg.src = fallbackPath;
                } else {
                    useInitials(profileImg);
                }
            });
        }
    };
    
    // Function to display initials when no image is available
    const useInitials = (imgElement) => {
        const parent = imgElement.parentElement;
        parent.classList.remove('loading');
        parent.classList.add('error');
        
        // Create initials as fallback
        const initials = document.createElement('div');
        initials.className = 'initials';
        initials.textContent = 'SA'; // Shams ul Arfeen initials
        parent.appendChild(initials);
        imgElement.style.display = 'none';
    };
    
    // Initialize
    addPrintButton();
    enhanceContactInfo();
    handleProfileImage();
    
    // Only add scroll animations on larger screens
    if (window.innerWidth > 768) {
        addScrollAnimation();
    }
}); 