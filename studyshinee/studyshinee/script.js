document.addEventListener('DOMContentLoaded', () => {

    // Initialize AOS Animation Library
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking a link
        document.querySelectorAll('nav ul li a:not(.dropbtn)').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });

        // Mobile Dropdown Toggle (Support multiple dropdowns)
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('click', function (e) {
                // Only toggle on mobile (when window width is small)
                if (window.innerWidth <= 1024) {
                    // Close other dropdowns
                    dropdowns.forEach(other => {
                        if (other !== dropdown) other.classList.remove('active');
                    });
                    this.classList.toggle('active');
                }
            });
        });
    }

    // Smooth Scroll for Internal Links (Legacy browser support)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const onclickAttr = this.getAttribute('onclick');
            // If it has an onclick (like our dynamic loader), don't preventdefault solely based on hash
            if (onclickAttr) return;

            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Infinite Marquee setup
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        const content = marqueeContent.innerHTML;
        // Triplicate content to ensure smooth scrolling without gaps
        marqueeContent.innerHTML = content + content + content;
    }

    // --- Supabase Setup ---
    // User provided Postgres: postgresql://postgres:[YOUR-PASSWORD]@db.lobuzkivhueqsyjlyiki.supabase.co:5432/postgres
    // Derived Project URL:
    const SUPABASE_URL = 'https://lobuzkivhueqsyjlyiki.supabase.co';
    // IMPORTANT: You must replace 'YOUR_SUPABASE_ANON_KEY' with your actual public Anon Key from Supabase Dashboard -> Project Settings -> API
    const SUPABASE_KEY = 'sb_publishable_C2Jrz75NIy0BUwgkDcA7aw_tYzkuyd3';

    // Check if Supabase library is loaded
    const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

    // Enquiry Form Handling with Supabase
    const enquiryForm = document.querySelector('.enquiry-form');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = enquiryForm.querySelector('button');
            const originalText = btn.innerText;

            // Get form values
            const name = enquiryForm.querySelector('input[placeholder="Your Name"]').value;
            const phone = enquiryForm.querySelector('input[placeholder="Phone Number"]').value;
            const message = enquiryForm.querySelector('textarea').value;

            // UI Feedback: Sending
            btn.innerText = 'Sending...';
            btn.style.opacity = '0.7';

            if (!supabase) {
                console.error('Supabase client not initialized. Check internet or API Key.');
                btn.innerText = 'Error: DB Not Linked';
                btn.style.backgroundColor = '#ff4444';
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.opacity = '1';
                }, 3000);
                return;
            }

            // Send to Supabase
            try {
                const { data, error } = await supabase
                    .from('enquiries')
                    .insert([
                        { name: name, phone: phone, message: message }
                    ]);

                if (error) throw error;

                // UI Feedback: Success
                btn.innerText = 'Sent Successfully!';
                btn.style.backgroundColor = '#ccff00';
                btn.style.color = 'black';
                enquiryForm.reset();

            } catch (error) {
                console.error('Error sending enquiry:', error);
                btn.innerText = 'Error! Try Again.';
                btn.style.backgroundColor = '#ff4444';
                btn.style.color = 'white';
            }

            // Reset button after delay
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
                btn.style.opacity = '1';
            }, 3000);
        });
    }
});

// Dynamic Course Content Data
const courseData = {
    'python': {
        title: 'Python <span class="highlight-text" data-text="Programming">Programming</span>',
        subtitle: '<i class="fab fa-python"></i> #1 Ranked Python Course',
        desc: '<p>Python is a versatile and powerful language. In this course, you will start from the very basics of syntax and data types, moving all the way to advanced concepts like creating web applications using Django/Flask and analyzing data with Pandas.</p>',
        modules: [
            { title: 'Introduction to Python', content: 'Introduction to Python programming language. Installation of Python and IDE (e.g., Anaconda, Jupyter Notebook). Basic syntax, variables, and data types (integers, floats, strings). Operators: arithmetic, comparison, logical. Control structures: if statements, loops (for, while). Practice exercises and coding assignments to reinforce concepts.' },
            { title: 'Functions and Data Structures', content: 'Defining and calling functions. Arguments and return values. Scope of variables. Data structures: Lists, Tuples, Dictionaries, and Sets. List comprehensions. Working with built-in functions.' },
            { title: 'File Handling and Modules', content: 'Reading from and writing to files. Working with standard libraries. Importing modules and packages. Error and exception handling (try-except blocks).' },
            { title: 'Object-Oriented Programming (OOP) Basics', content: 'Classes and objects. Attributes and methods. The __init__ method. Inheritance, Encapsulation, and Polymorphism in Python.' },
            { title: 'Introduction to Libraries and Packages', content: 'Installing packages with pip. Introduction to NumPy for numerical computing. Introduction to Matplotlib for data visualization.' },
            { title: 'Introduction to Data Analysis with Pandas', content: 'Working with DataFrames. Loading and clearing data. Basic data manipulation and analysis using Pandas.' }
        ],
        projects: [
            { title: "Sentiment Analysis Tool", desc: "Build a tool that analyzes social media comments to determine public sentiment using NLP.", icon_class: "fa-brain" },
            { title: "Personal Assistant Bot", desc: "Create a voice-controlled virtual assistant like Siri or Alexa using Python libraries.", icon_class: "fa-microphone" },
            { title: "Stock Price Predictor", desc: "Develop a machine learning model to predict future stock prices based on historical data.", icon_class: "fa-chart-line" },
            { title: "GUI Management System", desc: "Design a fully functional desktop application for inventory or library management using Tkinter.", icon_class: "fa-desktop" }
        ],
        features: ['Full Stack Certification', '100% Placement Support', 'Industry Expert Trainers'],
        img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    'java': {
        title: 'Java <span class="highlight-text" data-text="Full Stack">Full Stack</span>',
        subtitle: '<i class="fab fa-java"></i> Enterprise Application Development',
        desc: '<p>Become a complete Java Full Stack Developer. This course covers everything from Core Java to Advanced Java, Spring Boot, Microservices, and Frontend technologies like Angular/React.</p>',
        modules: [
            { title: 'Core Java Fundamentals', content: 'Java Syntax, Variables, Data Types, and Operators. Control Flow statements. Arrays and Strings.' },
            { title: 'Object-Oriented Programming in Java', content: 'Classes, Objects, Inheritance, Interface, and Abstraction. Exception Handling.' },
            { title: 'Java Collections Framework', content: 'List, Set, Map interfaces. Utility classes. Generics and Enums.' },
            { title: 'Advanced Java (J2EE)', content: 'JDBC connectivity. Servlets and JSP overview. Multi-threading and Lambda expressions.' },
            { title: 'Spring Boot & Hibernate', content: 'Building REST APIs with Spring Boot. Data persistence with Hibernate and Spring Data JPA.' },
            { title: 'Frontend with React/Angular', content: 'Building user interfaces. Component architecture. Integrating backend APIs.' }
        ],
        projects: [
            { title: "E-Banking System", desc: "Develop a secure banking portal with features like transaction history and fund transfers.", icon_class: "fa-university" },
            { title: "Hospital Management", desc: "Build an enterprise-level system to manage patient records and doctor appointments.", icon_class: "fa-hospital" },
            { title: "Social Connect App", desc: "A full-stack social media platfrom using Spring Boot backend and React frontend.", icon_class: "fa-share-alt" },
            { title: "Smart Inventory Bot", desc: "A Java-based system to automate warehouse tracking using advanced data structures.", icon_class: "fa-box-open" }
        ],
        features: ['Backend Mastery', 'Enterprise Architecture', 'MNC Interview Prep'],
        img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    'webdev': {
        title: 'Full Stack <span class="highlight-text" data-text="Web Dev">Web Dev</span>',
        subtitle: '<i class="fas fa-code"></i> MERN Stack Specialization',
        desc: '<p>Master the MERN stack (MongoDB, Express, React, Node.js). This course takes you from a beginner HTML/CSS coder to a proficient full-stack developer.</p>',
        modules: [
            { title: 'Frontend - HTML & CSS', content: 'Semantic HTML, CSS Layouts (Flexbox/Grid), Responsive Design, and CSS Animations.' },
            { title: 'JavaScript Essentials', content: 'ES6+ Features, DOM Manipulation, Async/Await, and API fetching.' },
            { title: 'React.js Framework', content: 'Components, Props, State, Hooks (useState, useEffect), and Routing.' },
            { title: 'Backend - Node.js & Express', content: 'Setting up servers, Middleware, Routing, and Auth with JWT.' },
            { title: 'Database - MongoDB', content: 'NoSQL concepts, Mongoose schemas, and performing CRUD operations.' },
            { title: 'Deployment & Portfolio', content: 'Hosting on Vercel/Heroku. Building a professional portfolio with real projects.' }
        ],
        projects: [
            { title: "E-Commerce Store", desc: "Build a complete online shop with cart functionality and payment integration.", icon_class: "fa-shopping-cart" },
            { title: "Real-time Chat App", desc: "Create a live messaging platform using Socket.io and React.", icon_class: "fa-comments" },
            { title: "Task Manager Pro", desc: "A productivity tool with drag-and-drop features and user authentication.", icon_class: "fa-tasks" },
            { title: "Recipe Finder", desc: "A dynamic web app that fetches recipes from an API based on ingredients.", icon_class: "fa-utensils" }
        ],
        features: ['Real Project Portfolio', 'MERN Certification', 'Code Review Sessions'],
        img: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    'ai': {
        title: 'Artificial <span class="highlight-text" data-text="Intelligence">Intelligence</span>',
        subtitle: '<i class="fas fa-brain"></i> Machine Learning & Deep Learning',
        desc: '<p>Step into the future. Learn statistics, machine learning algorithms, deep learning with TensorFlow, and NLP.</p>',
        modules: [
            { title: 'Mathematical Foundations', content: 'Linear Algebra, Calculus, and Statistics for AI.' },
            { title: 'Machine Learning Algorithms', content: 'Regression, Classification, Clustering, and Decision Trees.' },
            { title: 'Deep Learning', content: 'Neural Networks, CNNs for Vision, and RNNs for Sequential data.' },
            { title: 'Natural Language Processing', content: 'Text processing, Sentiment Analysis, and Transformers.' },
            { title: 'AI Ethics & Deployment', content: 'Responsible AI and deploying models to production.' }
        ],
        projects: [
            { title: "Face Recognition", desc: "Develop an AI system that identifies individuals using deep learning models.", icon_class: "fa-user-check" },
            { title: "Self-Driving Simulation", desc: "Build a virtual agent that learns to navigate through obstacles using reinforcement learning.", icon_class: "fa-car" },
            { title: "Language Translator", desc: "Create a real-time translation tool using neural machine translation.", icon_class: "fa-language" },
            { title: "Health Diagnosis Bot", desc: "An AI counselor that predicts potential health issues based on user symptoms.", icon_class: "fa-heartbeat" }
        ],
        features: ['AI Specialization', 'GPU Lab Access', 'Research Orientated'],
        img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    'datascience': {
        title: 'Data <span class="highlight-text" data-text="Science">Science</span>',
        subtitle: '<i class="fas fa-database"></i> Analytics & Visualization',
        desc: '<p>Master tools like Tableau, PowerBI, and SQL alongside Python to drive data-driven decision making.</p>',
        modules: [
            { title: 'Python for Data Science', content: 'NumPy, Pandas, and Matplotlib for data wrangling.' },
            { title: 'SQL & Database Management', content: 'Advanced SQL queries, Joins, and Indexing.' },
            { title: 'Data Visualization', content: 'Creating dashboards with Tableau and PowerBI.' },
            { title: 'Statistical Inference', content: 'Hypothesis testing, P-values, and Probability distributions.' },
            { title: 'Capstone Data Project', content: 'Solving a real-world business case using end-to-end data analysis.' }
        ],
        projects: [
            { title: "Sales Analysis Dashboard", desc: "A high-impact visualization of company sales trends and forecasting.", icon_class: "fa-chart-line" },
            { title: "Fraud Detection System", desc: "Identify suspicious transactions using outlier detection algorithms.", icon_class: "fa-user-secret" },
            { title: "Customer Clustering", desc: "Segment customers for targeted marketing using K-Means clustering.", icon_class: "fa-users" },
            { title: "Weather Prediction", desc: "Analyze climate data to forecast local weather patterns.", icon_class: "fa-cloud-sun" }
        ],
        features: ['Analytics Mastery', 'Business Case Studies', 'SQL Certification'],
        img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    'cloud': {
        title: 'Cloud <span class="highlight-text" data-text="Computing">Computing</span>',
        subtitle: '<i class="fas fa-cloud"></i> AWS & DevOps',
        desc: '<p>Learn to design and deploy scalable, fault-tolerant systems on AWS and master DevOps pipelines.</p>',
        modules: [
            { title: 'AWS Core Services', content: 'EC2, S3, RDS, & VPC configuration.' },
            { title: 'Serverless Computing', content: 'AWS Lambda, API Gateway, and DynamoDB.' },
            { title: 'Docker & Microservices', content: 'Containerization, Image management, and ECS/EKS.' },
            { title: 'CI/CD & DevOps', content: 'Jenkins, GitHub Actions, and Infrastructure as Code.' }
        ],
        projects: [
            { title: "Auto-Backup Architecture", desc: "Build a resilient cloud system that automatically backups on-premise data.", icon_class: "fa-cloud-upload-alt" },
            { title: "Serverless E-Learning", desc: "A scalable platform hosted entirely on AWS Lambda and DynamoDB.", icon_class: "fa-graduation-cap" },
            { title: "DevOps Pipeline", desc: "Setting up a full CI/CD automation for a large-scale web application.", icon_class: "fa-cogs" },
            { title: "Cloud Chat App", desc: "A real-time communication tool using AWS AppSync and Cognito.", icon_class: "fa-comments" }
        ],
        features: ['Cloud Lab Access', 'DevOps Certification', 'Real-world Deployment'],
        img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    'cyber': {
        title: 'Cyber <span class="highlight-text" data-text="Security">Security</span>',
        subtitle: '<i class="fas fa-shield-alt"></i> Ethical Hacking',
        desc: '<p>Secure the digital world. Learn penetration testing, network security, and cryptography.</p>',
        modules: [
            { title: 'Network Security Basics', content: 'OSI Model, TCP/IP, and Secure Network Protocols.' },
            { title: 'Ethical Hacking Methods', content: 'Footprinting, Scanning, and System Hacking.' },
            { title: 'Web App Security', content: 'OWASP Top 10, SQL Injection, and XSS prevention.' },
            { title: 'Cryptography', content: 'Encryption algorithms, Hashing, and Digital Signatures.' }
        ],
        projects: [
            { title: "Network Scanner", desc: "Build a tool to detect vulnerabilities in local area networks.", icon_class: "fa-broadcast-tower" },
            { title: "Encrypted Vault", desc: "A secure file storage system using advanced AES encryption.", icon_class: "fa-user-lock" },
            { title: "SQLi Protection Lab", desc: "Setting up a firewall to prevent SQL injection attacks.", icon_class: "fa-shield-alt" },
            { title: "Phishing Defender", desc: "An AI-based tool to detect and block malicious email links.", icon_class: "fa-fish" }
        ],
        features: ['CEH Preparation', 'CTF Challenges', 'Virtual Pentest Lab'],
        img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    'appdev': {
        title: 'App <span class="highlight-text" data-text="Development">Development</span>',
        subtitle: '<i class="fas fa-mobile-alt"></i> Flutter & Android',
        desc: '<p>Create high-performance apps for Android and iOS using Flutter and native technologies.</p>',
        modules: [
            { title: 'Mobile UI/UX Design', content: 'Material Design, Responsive layouts, and Animations.' },
            { title: 'Dart / Kotlin Language', content: 'Foundations of mobile-specific programming languages.' },
            { title: 'API & State Management', content: 'Connecting apps to backends and managing data flow.' },
            { title: 'Deployment to Stores', content: 'Publishing apps to Google Play Store and Apple App Store.' }
        ],
        projects: [
            { title: "Fitness Tracker", desc: "A mobile app that tracks workouts and monitors health progress.", icon_class: "fa-dumbbell" },
            { title: "Food Delivery App", desc: "Build a complete delivery system with live map tracking.", icon_class: "fa-utensils" },
            { title: "Education Portal", desc: "A mobile learning platform with video lectures and quiz features.", icon_class: "fa-book-open" },
            { title: "Smart City Guide", desc: "A localized app with AR features to help tourists find landmarks.", icon_class: "fa-city" }
        ],
        features: ['Build 3 Full Apps', 'Store Deployment', 'Cross-Platform Mastery'],
        img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    'uiux': {
        title: 'UI/UX <span class="highlight-text" data-text="Design">Design</span>',
        subtitle: '<i class="fas fa-pencil-ruler"></i> User Experience Design',
        desc: '<p>Design isn\'t just about looks, it\'s about how it works. Learn wireframing and prototyping in Figma.</p>',
        modules: [
            { title: 'Design Thinking', content: 'User Research, Empathy mapping, and Persona development.' },
            { title: 'Wireframing & Prototyping', content: 'Building low-fidelity and high-fidelity prototypes in Figma.' },
            { title: 'Visual Design Systems', content: 'Color theory, Typography, and Component libraries.' },
            { title: 'Usability Testing', content: 'Testing designs with users and iterating on feedback.' }
        ],
        projects: [
            { title: "Fin-Tech Dashboard", desc: "Redesigning a modern banking dashboard for intuitive use.", icon_class: "fa-credit-card" },
            { title: "Travel Planner App", desc: "A visual prototype of a high-end personal itinerary tool.", icon_class: "fa-plane" },
            { title: "Smart Home UI", desc: "Designing an IoT control interface for voice and touch.", icon_class: "fa-home" },
            { title: "E-Commerce Re-brand", desc: "A complete visual identity overhaul for an online retail brand.", icon_class: "fa-tags" }
        ],
        features: ['Figma Mastery', 'Design Portfolio', 'User Research Cert'],
        img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    'digital': {
        title: 'Digital <span class="highlight-text" data-text="Marketing">Marketing</span>',
        subtitle: '<i class="fas fa-bullhorn"></i> Online Growth Strategies',
        desc: '<p>Master SEO, Social Media Marketing, and Google Ads to build brands and drive sales.</p>',
        modules: [
            { title: 'SEO Mastery', content: 'On-page, Off-page, and Technical SEO strategies.' },
            { title: 'Social Media Strategy', content: 'Facebook, Instagram, and LinkedIn marketing techniques.' },
            { title: 'Paid Advertising (PPC)', content: 'Setting up and optimizing Google Ads and Meta Ads.' },
            { title: 'Email & Content Marketing', content: 'Copywriting and automated email sequences.' }
        ],
        projects: [
            { title: "Brand Viral Campaign", desc: "Executing a live social media campaign that drives 10k+ reach.", icon_class: "fa-fire" },
            { title: "SEO Audit Pro", desc: "Perform a complete website optimization study and boost ranking.", icon_class: "fa-search" },
            { title: "E-mail Automation", desc: "Set up a highly converting funnel for an e-commerce client.", icon_class: "fa-envelope-open-text" },
            { title: "Meta Ads Mastery", desc: "Generating high-quality leads using targeted Facebook advertising.", icon_class: "fa-bullseye" }
        ],
        features: ['Google Certification', 'Live Campaigns', 'Brand Strategy'],
        img: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    'cpp': {
        title: 'C / <span class="highlight-text" data-text="C++ Programming">C++ Programming</span>',
        subtitle: '<i class="fas fa-terminal"></i> Foundation of Software Engineering',
        desc: '<p>Master the fundamentals of computer science with C and C++. Learn memory management, pointers, and object-oriented programming from scratch.</p>',
        modules: [
            { title: 'C Fundamentals', content: 'Variables, Data Types, and Operators. Control Flow, Functions, and Arrays.' },
            { title: 'Pointers & Memory', content: 'Understanding memory addresses, pointers, and dynamic memory allocation.' },
            { title: 'OOP in C++', content: 'Classes, Objects, Inheritance, and Polymorphism. Constructors and Destructors.' },
            { title: 'STL (Standard Template Library)', content: 'Vectors, Strings, Maps, and Algorithms.' }
        ],
        projects: [
            { title: "Operating System Intro", desc: "Build a simplified process scheduler or memory manager.", icon_class: "fa-laptop" },
            { title: "High-Speed Game Engine", desc: "Create a 2D physics-based game using C++ classes.", icon_class: "fa-gamepad" },
            { title: "Library Search Tool", desc: "A fast database search tool using advanced C++ STL algorithms.", icon_class: "fa-book" },
            { title: "Calculator Pro", desc: "A complex mathematical expression evaluator with GUI elements.", icon_class: "fa-calculator" }
        ],
        features: ['Logic Building', 'System Level Training', 'Placement Readiness'],
        img: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    'php': {
        title: 'PHP <span class="highlight-text" data-text="Programming">Programming</span>',
        subtitle: '<i class="fab fa-php"></i> Web Backend Specialist',
        desc: '<p>Learn PHP to build dynamic web applications. We cover everything from basic syntax to MySQL integration and MVC architecture.</p>',
        modules: [
            { title: 'PHP Basics', content: 'Variables, Strings, and Global arrays. Form handling (GET/POST).' },
            { title: 'MySQL Integration', content: 'Connecting PHP with MySQL databases. CRUD operations.' },
            { title: 'Security in PHP', content: 'Session management, SQL injection prevention, and password hashing.' }
        ],
        projects: [
            { title: "Student Portal", desc: "A dynamic PHP-driven site for student management and grading.", icon_class: "fa-graduation-cap" },
            { title: "Blog Platform", desc: "Build a full CMS with article creation, categories, and comments.", icon_class: "fa-pen-fancy" },
            { title: "Job Portal", desc: "A high-end application for connecting recruiters with job seekers.", icon_class: "fa-briefcase" },
            { title: "E-Payment Gateway", desc: "Integrating safe payment processing into a PHP web app.", icon_class: "fa-money-bill-wave" }
        ],
        features: ['Server-Side Mastery', 'Database Heavy Projects', 'Freelancing Ready'],
        img: 'https://images.unsplash.com/photo-1599507591144-66b16294769c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    'csharp': {
        title: 'C# <span class="highlight-text" data-text=".NET Mastery">.NET Mastery</span>',
        subtitle: '<i class="fas fa-windows"></i> Microsoft Tech Stack',
        desc: '<p>Build robust applications using C# and the .NET framework. Learn Desktop, Web, and Cloud development with Microsoft technologies.</p>',
        modules: [
            { title: 'C# Language Basics', content: 'Classes, Methods, Properties, and Namespaces.' },
            { title: 'ASP.NET Core', content: 'Building Web APIs and Web Applications with .NET Core.' },
            { title: 'Entity Framework', content: 'Database interaction with LINQ and SQL Server.' }
        ],
        projects: [
            { title: "POS System", desc: "A professional Point of Sale desktop application for retail.", icon_class: "fa-store" },
            { title: "Web API Service", desc: "Build a scalable REST API using ASP.NET Core.", icon_class: "fa-cloud" },
            { title: "Game with Unity", desc: "Develop an interactive 3D environment using C# and Unity.", icon_class: "fa-ghost" },
            { title: "Cloud Storage Manager", desc: "Microsoft Azure-integrated tool for managing cloud assets.", icon_class: "fa-hdd" }
        ],
        features: ['Enterprise-Grade Skills', 'Microsoft Ecosystem', 'High Demand Jobs'],
        img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    'sql': {
        title: 'SQL <span class="highlight-text" data-text="& Database">& Database</span>',
        subtitle: '<i class="fas fa-database"></i> Database Management',
        desc: '<p>Data is the new oil. Learn to extract, manipulate, and manage datasets using SQL Server, MySQL, and PostgreSQL.</p>',
        modules: [
            { title: 'SQL Fundamentals', content: 'SELECT queries, Filtering, and Sorting data.' },
            { title: 'Advanced Queries', content: 'Joins, Subqueries, and Aggregate functions (GROUP BY).' },
            { title: 'DB Administration', content: 'Creating tables, Indexing, and Transaction management.' }
        ],
        projects: [
            { title: "Employee DB System", desc: "A complex database architecture for large organizations.", icon_class: "fa-user-tie" },
            { title: "E-Comm SQL Analysis", desc: "Analyzing large scale retail data using advanced JOINS.", icon_class: "fa-shopping-cart" },
            { title: "Banking DB Backup", desc: "Developing fail-safe replication and backup SQL scripts.", icon_class: "fa-university" },
            { title: "Query Optimizer Tool", desc: "A system to analyze and improve slow database queries.", icon_class: "fa-bolt" }
        ],
        features: ['Data Analytics Focus', 'Queries Optimization', 'Big Data Intro'],
        img: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    'tally': {
        title: 'Tally <span class="highlight-text" data-text="ERP 9 / Prime">ERP 9 / Prime</span>',
        subtitle: '<i class="fas fa-file-invoice-dollar"></i> Business Accounting',
        desc: '<p>Become a professional accountant. Learn GST, Payroll, Inventory Management, and Taxation using Tally Prime.</p>',
        modules: [
            { title: 'Accounting Basics', content: 'Double entry system, Ledger creation, and Trial Balance.' },
            { title: 'Inventory & GST', content: 'Stock management, GST invoicing, and Tax returns.' },
            { title: 'Payroll Management', content: 'Employee records, Salary processing, and Statutory deductions.' }
        ],
        projects: [
            { title: "GST Audit Report", desc: "Compiling a professional GST compliance report for a business.", icon_class: "fa-balance-scale" },
            { title: "Payroll Setup", desc: "Configuring a multi-employee payroll system in Tally Prime.", icon_class: "fa-money-bill-wave" },
            { title: "Inventory Tracker", desc: "Real-time stock management and re-ordering logic system.", icon_class: "fa-box" },
            { title: "Tax Auditor Pro", desc: "Preparing automated tax return filings for corporate clients.", icon_class: "fa-file-invoice" }
        ],
        features: ['GST Specialist', 'Accounting Certification', 'Business Ready'],
        img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    'fullstackjava': {
        title: 'Fullstack <span class="highlight-text" data-text="Java Mastery">Java Mastery</span>',
        subtitle: '<i class="fab fa-java"></i> Professional Backend + React',
        desc: '<p>The ultimate Java career path. Master Java, Spring Boot, and React to build scalable enterprise-level web applications.</p>',
        modules: [
            { title: 'Java Mastery', content: 'Advanced Java, Collections, and Multi-threading.' },
            { title: 'Spring Boot Ecosystem', content: 'Spring MVC, Spring Data, and Spring Security.' },
            { title: 'React Frontend', content: 'Hooks, Redux / Context API, and Styled Components.' },
            { title: 'Microservices Architecture', content: 'Building and deploying microservices with Docker.' }
        ],
        projects: [
            { title: "Corporate LMS", desc: "A full-scale Learning Management System for MNC employee training.", icon_class: "fa-building" },
            { title: "Fin-Tech API Suite", desc: "Building a secure backend for modern financial applications.", icon_class: "fa-credit-card" },
            { title: "Global Search Engine", desc: "A fast, scalable search interface using Java and Microservices.", icon_class: "fa-search" },
            { title: "Service Connect", desc: "A real-time service booking platform (like Urban Company).", icon_class: "fa-tools" }
        ],
        features: ['Enterprise Projects', 'Microservices Focus', 'Top MNC Placement'],
        img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    'fullstackpython': {
        title: 'Fullstack <span class="highlight-text" data-text="Python Mastery">Python Mastery</span>',
        subtitle: '<i class="fab fa-python"></i> Django / Flask + React',
        desc: '<p>Master Python for the full web stack. Learn Django/Flask for the backend and React for modern, fast frontends.</p>',
        modules: [
            { title: 'Mastering Python', content: 'Advanced Python, Decorators, and Generators.' },
            { title: 'Django Backend', content: 'Models, Views, Templates, and Django REST Framework.' },
            { title: 'React Mastery', content: 'Modern React patterns and frontend architecture.' },
            { title: 'Deployment & CI/CD', content: 'Deploying with Gunicorn, Nginx, and GitHub Actions.' }
        ],
        projects: [
            { title: "AI-Powered Store", desc: "An e-commerce platform with smart item recommendations.", icon_class: "fa-robot" },
            { title: "SaaS Task Manager", desc: "A subscription-based productivity tool with team features.", icon_class: "fa-rocket" },
            { title: "Real-time Tracker", desc: "A Django-based live location or stock market tracking app.", icon_class: "fa-map-marker-alt" },
            { title: "Content Hub", desc: "A large-scale media sharing site using Python/Django and React.", icon_class: "fa-folder-open" }
        ],
        features: ['Fullstack Specialization', 'Python Expert Trainer', 'Rapid Development'],
        img: 'https://images.unsplash.com/photo-1536148935079-bd35191fe2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
};

// Function called by navigation to load a course page
function loadCourse(courseKey, type = 'course') {
    window.location.href = `course-details.html?course=${courseKey}&type=${type}`;
}

function resetHero() {
    window.location.href = 'index.html';
}

// Global toggle for accordion
function toggleModule(header) {
    const card = header.parentElement;
    const body = card.querySelector('.module-body');
    const icon = header.querySelector('.plus');

    // Close all others
    document.querySelectorAll('.module-card').forEach(other => {
        if (other !== card) {
            other.classList.remove('active');
            other.querySelector('.module-body').style.maxHeight = null;
            other.querySelector('.plus').innerText = '+';
        }
    });

    // Toggle current
    card.classList.toggle('active');
    if (card.classList.contains('active')) {
        body.style.maxHeight = body.scrollHeight + "px";
        icon.innerText = '-';
    } else {
        body.style.maxHeight = null;
        icon.innerText = '+';
    }
}

// Function called by individual course pages to render content
window.loadCourseDetails = function (courseKey) {
    const data = courseData[courseKey];
    if (!data) return;

    // Detect Page Type (Internship vs Course)
    const urlParams = new URLSearchParams(window.location.search);
    const pageType = urlParams.get('type') || 'course';

    // Update Titles
    const titleEl = document.getElementById('detail-title');
    if (titleEl) titleEl.innerHTML = data.title;

    const labelEl = document.getElementById('page-type-label');
    if (labelEl) labelEl.innerText = pageType === 'internship' ? 'Internship Program' : 'Courses';

    const breadTitle = document.getElementById('bread-title');
    if (breadTitle) breadTitle.innerText = data.title.replace(/<[^>]*>?/gm, '');

    // Update Content
    const descEl = document.getElementById('detail-desc');
    if (descEl) descEl.innerHTML = data.desc;

    const imgEl = document.getElementById('detail-img');
    if (imgEl && data.img) imgEl.src = data.img;

    const featureList = document.getElementById('detail-features');
    if (featureList && data.features) {
        featureList.innerHTML = data.features.map(f => `<li><i class="fas fa-check-circle" style="color:#ccff00; margin-right:15px;"></i> ${f}</li>`).join('');
    }

    // --- Restore Original Accordion Curriculum ---
    const modulesContainer = document.getElementById('detail-modules');
    if (modulesContainer) {
        modulesContainer.innerHTML = '';
        data.modules.forEach((mod, index) => {
            modulesContainer.innerHTML += `
            <div class="module-card ${index === 0 ? 'active' : ''}">
                <div class="module-header" onclick="toggleModule(this)">
                    <span class="module-title">${mod.title}</span>
                    <span class="plus">${index === 0 ? '−' : '+'}</span>
                </div>
                <div class="module-body" style="${index === 0 ? 'max-height: 1000px;' : ''}">
                    <div class="module-content">
                        ${mod.content}
                    </div>
                </div>
            </div>
        `;
        });
    }

}





// Global project selector
function setActiveProject(card) {
    // Remove active class from all projects in the current grid
    const parent = card.parentElement;
    parent.querySelectorAll('.project-card-premium').forEach(p => {
        p.classList.remove('featured-project');
    });

    // Add active class to clicked card
    card.classList.add('featured-project');
}

// Reset Hero
// Student Modal Control
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('student-modal');
    const closeModalBtn = document.querySelector('.close-modal');

    // Select the modal form specifically
    const modalForm = document.querySelector('.modal-form');

    // Check if Supabase is already initialized in the previous block (global scope check might fail if not exposed)
    // We will re-initialize or check window.supabase.
    // Ideally, we should unify the initialization, but for this append step:
    const SUPABASE_URL = 'https://lobuzkivhueqsyjlyiki.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_C2Jrz75NIy0BUwgkDcA7aw_tYzkuyd3';
    const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

    if (modal) {
        // Show modal immediately on page load
        modal.classList.add('show');

        // Close Modal button
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }

        // Close when clicking outside the modal
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });



        // Modal Form Handling
        if (modalForm) {
            modalForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = modalForm.querySelector('button');
                const originalText = btn.innerText;

                const name = modalForm.querySelector('input[placeholder="Student Name"]').value;
                const phone = modalForm.querySelector('input[placeholder="Mobile Number"]').value;
                const course = modalForm.querySelector('select').value;

                // Construct a message payload
                const message = `[Popup Lead] Interest: ${course}`;

                btn.innerText = 'Submitting...';
                btn.style.opacity = '0.7';

                if (supabase) {
                    try {
                        const { error } = await supabase
                            .from('enquiries')
                            .insert([{ name, phone, message }]);

                        if (error) throw error;

                        btn.innerText = 'Success! calling you soon.';
                        btn.style.backgroundColor = '#ccff00';
                        btn.style.color = 'black';

                        setTimeout(() => {
                            modal.classList.remove('show');
                            modalForm.reset();
                            btn.innerText = originalText;
                            btn.style.backgroundColor = '';
                            btn.style.color = '';
                            btn.style.opacity = '1';
                        }, 2000);

                    } catch (err) {
                        console.error(err);
                        btn.innerText = 'Error. Try Again.';
                        btn.style.backgroundColor = '#ff4444';
                    }
                } else {
                    // Fallback Visual
                    btn.innerText = 'Done!';
                    setTimeout(() => {
                        modal.classList.remove('show');
                        btn.innerText = originalText;
                    }, 2000);
                }
            });
        }
    }
});

// Payment Modal Logic
function openPaymentModal(amount) {
    const modal = document.getElementById('payment-modal');
    const amountDisplay = document.getElementById('pay-amount-display');
    if (modal && amountDisplay) {
        amountDisplay.innerText = `₹ ${amount}/-`;
        modal.classList.add('show');
    }
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Close payment modal on click outside
// Course Slider Logic
// Course Slider Logic - Infinite "Round" Scroll
const sliderTrack = document.querySelector('.course-slider-track');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

if (sliderTrack && prevBtn && nextBtn) {
    // 1. Clone cards for infinite loop effect
    const originalCards = Array.from(sliderTrack.children);
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        sliderTrack.appendChild(clone);
    });

    let scrollAmount = 0;

    // Auto Scroll logic
    let autoScroll = setInterval(() => { nextBtn.click(); }, 3000);

    // Pause on hover
    sliderTrack.addEventListener('mouseenter', () => clearInterval(autoScroll));
    sliderTrack.addEventListener('mouseleave', () => {
        autoScroll = setInterval(() => { nextBtn.click(); }, 3000);
    });

    const getScrollStep = () => {
        const card = document.querySelector('.course-card-new');
        if (!card) return 0;
        const gap = 40;
        const cardWidth = card.offsetWidth + gap;
        const itemsToScroll = window.innerWidth < 1024 ? 1 : 2;
        return cardWidth * itemsToScroll;
    };

    // Helper to animate and handle reset
    const smoothScroll = () => {
        sliderTrack.style.transition = 'transform 0.5s ease-in-out';
        sliderTrack.style.transform = `translateX(-${scrollAmount}px)`;
    };

    const jumpTo = (pos) => {
        sliderTrack.style.transition = 'none';
        scrollAmount = pos;
        sliderTrack.style.transform = `translateX(-${scrollAmount}px)`;
    };

    nextBtn.addEventListener('click', () => {
        const step = getScrollStep();
        if (step === 0) return;

        // Calculate single set width (half of total usage since we doubled it)
        // Note: We use scrollWidth of the TRACK, but we need the width of the ORIGINAL items
        // The track logic works best if we base it on item counts
        const card = document.querySelector('.course-card-new');
        const gap = 30;
        const singleSetWidth = (card.offsetWidth + gap) * originalCards.length;

        scrollAmount += step;
        smoothScroll();

        // Check if we have scrolled past the original set
        // If scrollAmount reaches singleSetWidth, we are viewing the start of the Clones
        // which looks identical to start of Original (0).
        if (scrollAmount >= singleSetWidth) {
            setTimeout(() => {
                // Instantly jump back to start of Original set relative to where we are
                // If we are exactly at singleSetWidth, we jump to 0.
                // If we overshot slightly (unlikely with fixed steps), we adjust.
                const overflow = scrollAmount - singleSetWidth;
                jumpTo(overflow);
            }, 500); // 500ms matches CSS transition
        }
    });

    prevBtn.addEventListener('click', () => {
        const step = getScrollStep();
        if (step === 0) return;

        const card = document.querySelector('.course-card-new');
        const gap = 30;
        const singleSetWidth = (card.offsetWidth + gap) * originalCards.length;

        if (scrollAmount <= 0) {
            // If at 0, we can't scroll left smoothly.
            // First, jump to the end of the cloned set (which looks like end of original)
            jumpTo(singleSetWidth);
            // Force reflow/small delay to allow jump to render before animating back
            setTimeout(() => {
                scrollAmount -= step;
                smoothScroll();
            }, 50);
        } else {
            scrollAmount -= step;
            smoothScroll();
        }
    });
}

// Brochure Modal Logic
function openBrochureModal(courseName) {
    const modal = document.getElementById('brochure-modal');
    if (modal) {
        document.getElementById('brochure-course-name').value = courseName;
        modal.classList.add('show');
    }
}

function closeBrochureModal() {
    const modal = document.getElementById('brochure-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Close Brochure Modal on outside click
window.addEventListener('click', (e) => {
    const bModal = document.getElementById('brochure-modal');
    if (e.target === bModal) {
        closeBrochureModal();
    }
});

/**
 * Recent Activity Toast (Social Proof)
 * Displays popups of recent student registrations
 */
const recentRegistrations = [
    { name: "Pooja Sri", flex: "from Coimbatore", action: "signed up for", course: "Full Stack Java" },
    { name: "Priya", flex: "from Chennai", action: "enrolled in", course: "Python Full Stack" },
    { name: "Barath", flex: "from Chennai", action: "joined", course: "C with Java" },
    { name: "Naveen", flex: "from Coimbatore", action: "registered for", course: "Java Full Stack" },
    { name: "Karthik", flex: "from Madurai", action: "joined", course: "AWS Course" },
    { name: "Divya", flex: "from Coimbatore", action: "enrolled in", course: "DevOps" },
    { name: "Nandhini", flex: "from Erode", action: "joined", course: "Machine Learning" },
    { name: "Dhanyaa", flex: "from Pollachi", action: "registered for", course: "Web Development" },
    { name: "Suresh", flex: "from Trichy", action: "joined", course: "AI Course" },
    { name: "Anjali", flex: "from Coimbatore", action: "enrolled in", course: "Cyber Security" }
];

let regIndex = 0;
const regDisplayTime = 5000;
const regGapTime = 8000;

function initRecentActivity() {
    // Create the toast HTML if it doesn't exist
    if (!document.getElementById("signup-popup")) {
        const toastHTML = `
            <div id="signup-popup" class="signup-popup">
                <div class="popup-content">
                    <span class="close-btn" onclick="closeRegistrationPopup()">&times;</span>
                    <div class="popup-icon">😊</div>
                    <div class="popup-text" id="popup-reg-text"></div>
                </div>
                <div class="progress-bar">
                    <div class="progress" id="reg-progress"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', toastHTML);
    }

    // Start the cycle after a short delay
    setTimeout(showRegistrationToast, 3000);
}

function showRegistrationToast() {
    const popup = document.getElementById("signup-popup");
    const textEl = document.getElementById("popup-reg-text");
    const progress = document.getElementById("reg-progress");

    if (!popup || !textEl || !progress) return;

    if (regIndex >= recentRegistrations.length) regIndex = 0; // Loop back

    const reg = recentRegistrations[regIndex];
    textEl.innerHTML = `<strong>${reg.name} ${reg.flex}</strong> ${reg.action} <strong>${reg.course}</strong>`;
    popup.style.display = "block";

    // Start progress bar
    progress.style.transition = "none";
    progress.style.width = "0%";

    // Force reflow
    void progress.offsetWidth;

    progress.style.transition = `width ${regDisplayTime}ms linear`;
    progress.style.width = "100%";

    // Hide after display time
    setTimeout(() => {
        closeRegistrationPopup();
        regIndex++;
        // Schedule next toast
        setTimeout(showRegistrationToast, regGapTime);
    }, regDisplayTime);
}

function closeRegistrationPopup() {
    const popup = document.getElementById("signup-popup");
    if (popup) {
        popup.style.display = "none";
    }
}

/**
 * Sidebar Social (Fixed Right)
 */
function initSidebar() {
    if (!document.getElementById("fixed-social-sidebar")) {
        const sidebarHTML = `
            <div id="fixed-social-sidebar" class="sidebar-right">
                <div class="connect-text">Connect With Us</div>
                <div class="social-icons">
                    <a href="https://wa.me/917418540249?text=Hello%20I%20am%20interested%20in%20your%20service" target="_blank"><i class="fab fa-whatsapp"></i></a>
                    <a href="https://www.facebook.com/profile.php?id=100095239347806" target="_blank"><i class="fab fa-facebook-f"></i></a>
                    <a href="https://www.instagram.com/studyshineesoftwaresolution?igsh=MThubDAxc3E4aHZmeg==" target="_blank"><i class="fab fa-instagram"></i></a>
                    <a href="https://www.linkedin.com/company/110509030/admin/dashboard/" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                </div>
                <div class="vertical-line"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', sidebarHTML);
    }
}

// Global initialization call
document.addEventListener('DOMContentLoaded', () => {
    initRecentActivity();
    // initSidebar(); // Removed sidebar as per request
});
