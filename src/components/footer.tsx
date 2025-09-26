import React from 'react';


const Footer = () => {
    

    const linkClassName = "hover:text-white transition-colors duration-200 footer-link";
    const titleClassName = "text-lg font-semibold text-white mb-4";
    const addressLinkClassName = "hover:text-white transition-colors duration-200";

    return (
        <div className="min-h-screen flex flex-col justify-end">
            
      
            <footer className="bg-gray-900 text-gray-400 pt-16 pb-12 shadow-inner rounded-t-xl w-full">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

      
                    <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 mb-16 border-b border-gray-700 pb-10">

      
                        <div>
                            <h3 className={titleClassName}>Resources</h3>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className={linkClassName}>Support</a></li>
                                <li><a href="#" className={linkClassName}>FAQ</a></li>
                                <li><a href="#" className={linkClassName}>Security</a></li>
                                <li><a href="#" className={linkClassName}>Reviews</a></li>
                                <li><a href="#" className={linkClassName}>Industries</a></li>
                                <li><a href="#" className={linkClassName}>Become a partner</a></li>
                            </ul>
                        </div>

      
                        <div>
                            <h3 className={titleClassName}>Company</h3>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className={linkClassName}>About Us</a></li>
                                <li><a href="#" className={linkClassName}>GDPR</a></li>
                                <li><a href="#" className={linkClassName}>Terms and Conditions</a></li>
                                <li><a href="#" className={linkClassName}>Privacy Policy</a></li>
                                <li><a href="#" className={linkClassName}>Contact Us</a></li>
                                <li>
                                    <a href="#" className="text-orange-500 font-medium hover:text-orange-400 transition-colors duration-200">We are hiring!</a>
                                </li>
                            </ul>
                        </div>

                
                        <div className="lg:col-span-1">
                            <h3 className={titleClassName}>Product Features</h3>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className={linkClassName}>Integrations</a></li>
                                <li><a href="#" className={linkClassName}>Implementation</a></li>
                            </ul>
                        </div>

                 
                        <div className="col-span-2 sm:col-span-3 lg:col-span-2 xl:col-span-2">

                 
                            <div className="mb-8">
                                <h3 className={titleClassName}>Download Our App</h3>
                                <div className="flex flex-wrap gap-4">
                 
                                    <a href="https://play.google.com/store/apps/details?id=com.resourceinnplus.attendance" target="_blank" rel="noopener noreferrer" className="w-40 h-12 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center hover:opacity-80 transition-opacity">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-10" />
                                    </a>
                 
                                    <a href="https://apps.apple.com/in/app/resourceinn/id1545119160" target="_blank" rel="noopener noreferrer" className="w-40 h-12 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center hover:opacity-80 transition-opacity">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="h-10" />
                                    </a>
                                </div>
                            </div>

                 
                            <div>
                                <h3 className={titleClassName}>Lets Get Social</h3>
                                <div className="flex space-x-4">
                                    
                 
                                    <a href="https://facebook.com/ResourceInn" target="_blank" rel="noopener noreferrer" className="text-2xl text-blue-600 hover:text-blue-500 transition-colors duration-200">
                                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                        </svg>
                                    </a>

                       
                                    <a href="https://www.linkedin.com/company/resourceinnhrms/" target="_blank" rel="noopener noreferrer" className="text-2xl text-blue-400 hover:text-blue-300 transition-colors duration-200">
                                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                            <rect x="2" y="9" width="4" height="12"/>
                                            <circle cx="4" cy="4" r="2"/>
                                        </svg>
                                    </a>

                       
                                    <a href="https://youtube.com/@ResourceInn" target="_blank" rel="noopener noreferrer" className="text-2xl text-red-600 hover:text-red-500 transition-colors duration-200">
                                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                            <path d="M21.5 8.3c-.6-.7-1.4-1.2-2.3-1.4C18.1 6.6 12 6.6 12 6.6s-6.1 0-7.2.3c-.9.2-1.7.7-2.3 1.4C1.9 9 1.5 10.3 1.5 12s.4 3 1.1 3.7c.6.7 1.4 1.2 2.3 1.4 1.1.3 7.2.3 7.2.3s6.1 0 7.2-.3c.9-.2 1.7-.7 2.3-1.4.7-.7 1.1-2 1.1-3.7s-.4-3-1.1-3.7zM9.5 15.4V8.6l6 3.4z"/>
                                        </svg>
                                    </a>

                       
                                    <a href="https://www.instagram.com/resourceinnhrms/" target="_blank" rel="noopener noreferrer" className="text-2xl text-pink-500 hover:text-pink-400 transition-colors duration-200">
                                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>

                 
                    <div className="grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">

                 
                        <div>
                            <h3 className={titleClassName}>Pakistan Office</h3>
                            <address className="not-italic space-y-2 text-sm">
                                <p className="text-gray-200 font-medium">
                                    <a href="mailto:sales@resourceinn.com" className={addressLinkClassName}>sales@resourceinn.com</a>
                                </p>
                                <p className="text-gray-200">
                                    <a href="tel:+923214858301" className={addressLinkClassName}>+92 (321) 4858301</a>
                                </p>
                                <p>31-B/J3 Johar Town, Lahore.</p>
                                <p>C-46, PECHS Block 6, Moin Shahra-e-Faisal, Karachi.</p>
                            </address>
                        </div>

                 
                        <div>
                            <h3 className={titleClassName}>USA Office</h3>
                            <address className="not-italic space-y-2 text-sm">
                                <p className="text-gray-200 font-medium">
                                    <a href="mailto:sales@resourceinn.com" className={addressLinkClassName}>sales@resourceinn.com</a>
                                </p>
                                <p className="text-gray-200">
                                    <a href="tel:+19156612930" className={addressLinkClassName}>+1 (915) 661 2930</a>
                                </p>
                                <p>19 Belmont Ave Unit #157 Brooklyn NY 11212 United States.</p>
                            </address>
                        </div>

                      
                        <div>
                            <h3 className={titleClassName}>Australia Office</h3>
                            <address className="not-italic space-y-2 text-sm">
                                <p className="text-gray-200 font-medium">
                                    <a href="mailto:sales@resourceinn.com" className={addressLinkClassName}>sales@resourceinn.com</a>
                                </p>
                                <p className="text-gray-200">
                                    <a href="tel:+61280058641" className={addressLinkClassName}>+61 2 8005 8641</a>
                                </p>
                                <p>U323/5 Vermont Crescent, Riverwood, New South Wales, Australia.</p>
                            </address>
                        </div>

                    </div>
                </div>

<div  className="row m-20 text-lg text-center"><p>Copyrights © Resourceinn 2016-2025 | Powered by <a className="text-orange-500  height-[32px]" href="https://resourceinn.com/wp-content/uploads/2023/06/GEEKINN-Company-Profile.pdf" rel="noopener">Geekinn(Pvt) Ltd.</a></p></div>
            </footer>
            
        </div>
    );
};

export default Footer;
