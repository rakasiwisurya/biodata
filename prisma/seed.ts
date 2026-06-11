import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient, SkillCategory, CertificateKind } from "@prisma/client";
import { ensureBucketPublic, uploadObject } from "../src/lib/minio";

const prisma = new PrismaClient();

async function uploadAssets() {
  await ensureBucketPublic();

  const cvBuffer = readFileSync(join(process.cwd(), "public", "cv", "CV_Rakasiwi_Surya.pdf"));
  const cvUrl = await uploadObject("cv/CV_Rakasiwi_Surya.pdf", cvBuffer, "application/pdf");

  const avatarBuffer = readFileSync(join(process.cwd(), "public", "avatar-placeholder.svg"));
  const avatarUrl = await uploadObject("avatar/default-avatar.svg", avatarBuffer, "image/svg+xml");

  return { cvUrl, avatarUrl };
}

async function main() {
  console.log("Uploading assets to MinIO...");
  const { cvUrl, avatarUrl } = await uploadAssets();
  console.log(`  CV: ${cvUrl}`);
  console.log(`  Avatar: ${avatarUrl}`);

  console.log("Clearing existing data...");
  await prisma.project.deleteMany();
  await prisma.workExperience.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.education.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.profile.deleteMany();

  console.log("Seeding profile...");
  await prisma.profile.create({
    data: {
      id: "singleton",
      name: "Rakasiwi Surya",
      headline: "Fullstack Developer",
      heroDescription:
        "Fullstack Developer with 4+ years of experience building web and mobile applications with React JS, Next JS, Node JS, Express JS, React Native, .Net Core, and Go Fiber. AI Enthusiast.",
      aboutDescription:
        "Fullstack Developer experienced in delivering enterprise, government, and healthcare applications — from ticketing platforms and smart warehouse IoT systems to HRIS, finance, and medical record applications. Comfortable owning both frontend and backend, migrating legacy systems, containerizing deployments with Docker and CI/CD, and collaborating closely with stakeholders to turn business requirements into scalable technical solutions. Ready to relocate overseas.",
      avatarUrl,
      cvUrl,
      email: "rakasiwi.surya@gmail.com",
      phone: "+6285715519890",
      location: "Bekasi, Jawa Barat, Indonesia (Ready to relocate overseas)",
    },
  });

  console.log("Seeding social links...");
  await prisma.socialLink.createMany({
    data: [
      { platform: "linkedin", url: "https://www.linkedin.com/in/rakasiwisurya", order: 0 },
      { platform: "github", url: "https://github.com/rakasiwisurya", order: 1 },
      { platform: "whatsapp", url: "https://wa.me/6285715519890", order: 2 },
      { platform: "email", url: "mailto:rakasiwi.surya@gmail.com", order: 3 },
    ],
  });

  console.log("Seeding work experiences...");
  const cipta = await prisma.workExperience.create({
    data: {
      company: "PT. Cipta Integrasi Nusantara",
      position: "Frontend Developer",
      location: "Remote",
      startDate: new Date("2025-12-29"),
      endDate: new Date("2026-01-29"),
      summary:
        "Frontend development for Medora, a hospital management system, focusing on bug fixing, localization, and adaptation for hospital tenders in Timor-Leste.",
      order: 0,
    },
  });
  const liga = await prisma.workExperience.create({
    data: {
      company: "PT. Liga Indonesia Baru (ILeague)",
      position: "System Development",
      location: "Jakarta, Indonesia",
      startDate: new Date("2024-09-02"),
      endDate: new Date("2025-07-18"),
      summary:
        "Led the full revamp of the internal HRIS from CodeIgniter 3 & MySQL to Next.js, Express.js, and Microsoft SQL Server as a solo fullstack developer, including infrastructure migration and CI/CD automation.",
      order: 1,
    },
  });
  const diksha = await prisma.workExperience.create({
    data: {
      company: "PT. Diksha Teknologi Indonesia",
      position: "Fullstack Developer",
      location: "Jakarta, Indonesia",
      startDate: new Date("2024-01-08"),
      endDate: new Date("2024-08-30"),
      summary:
        "Developed Xtra Non Trade, a web-based finance application for PT. Lion Super Indo, covering supplier invoice claim submissions and payment processes with SAP and DJP Indonesia integrations.",
      order: 2,
    },
  });
  const nutech = await prisma.workExperience.create({
    data: {
      company: "PT. Nutech Integrasi (Telkom Group)",
      position: "ReactJS Developer",
      location: "Jakarta, Indonesia",
      startDate: new Date("2022-01-03"),
      endDate: new Date("2024-01-02"),
      summary:
        "Built and maintained web and mobile applications for government and enterprise clients including DAMRI, Ministry of Transportation, Telkom Akses, Transjakarta, and Customs & Excise (Bea Cukai).",
      order: 3,
    },
  });

  console.log("Seeding projects...");
  await prisma.project.create({
    data: {
      title: "Medora — Medical Records Application",
      description:
        "Medora is a hospital management system supporting multiple roles — Administrators, Nurses (Emergency, Outpatient, Inpatient), Doctors, Pharmacy staff, and Admission officers. It integrates doctor schedules, SOAP medical documentation, nursing services, medical equipment tracking, patient medical records, and prescription handling forwarded to the pharmacy, ensuring a smooth patient journey from registration through consultation, treatment, and counter services.",
      responsibilities: [
        "Performed bug fixing and system troubleshooting to ensure application stability, accuracy, and reliability across all hospital management modules",
        "Translated application content and medical terminology from Indonesian into English, aligned with international healthcare practices",
        "Conducted system localization and adaptation by removing BPJS-related components and workflows for hospital tenders in Timor-Leste",
        "Adjusted business processes and system configurations to support non-BPJS healthcare environments",
      ],
      techStack: ["TypeScript", "React JS", "dayjs", "Radix UI"],
      teamSize: 7,
      periodStart: new Date("2025-12-01"),
      periodEnd: new Date("2026-01-29"),
      featured: true,
      order: 0,
      workExperienceId: cipta.id,
    },
  });
  await prisma.project.create({
    data: {
      title: "HRIS — PT. Liga Indonesia Baru",
      description:
        "Human Resource Information System (HRIS) is an internal enterprise application managing end-to-end employee administration: duty assignments and scheduling, leave management, daily-based overtime packages, attendance and absence tracking, and approval workflows. Includes a centralized employee database, organizational structure management, dynamic role-based access, and a master holiday system with Google Calendar integration.",
      responsibilities: [
        "Led the full revamp of the HRIS application from CodeIgniter 3 & MySQL to Next.js, Express.js, and Microsoft SQL Server",
        "Designed and implemented both frontend and backend architectures as a Fullstack Developer",
        "Maintained the legacy HRIS (CodeIgniter) during migration, fixing critical bugs and shipping urgent HR features",
        "Migrated server infrastructure from Windows Server to Ubuntu Server",
        "Converted manual FTP-based deployments into automated GitLab CI/CD pipelines",
        "Containerized applications and services using Docker",
        "Designed and implemented RESTful APIs for HR modules and business logic",
        "Developed core HR features: duty assignments, leave, overtime packages, absences, approval workflows",
        "Implemented dynamic user management with role-based access control (RBAC)",
        "Integrated Google Calendar for automated master holiday imports",
      ],
      techStack: [
        "TypeScript",
        "Next JS",
        "Ant Design",
        "Tailwind CSS",
        "Redux Toolkit",
        "Express JS",
        "Google Calendar",
        "Docker",
        "GitLab CI/CD",
        "MySQL",
        "Microsoft SQL Server",
        "CodeIgniter",
        "PHP",
        "Ubuntu Server",
      ],
      teamSize: 1,
      periodStart: new Date("2024-09-01"),
      periodEnd: new Date("2025-07-18"),
      featured: true,
      order: 1,
      workExperienceId: liga.id,
    },
  });
  await prisma.project.create({
    data: {
      title: "Xtra Non Trade — PT. Lion Super Indo",
      description:
        "A web-based finance application facilitating supplier invoice claim submissions and payment processes for service and non-trade goods claims. Replaces the manual process where suppliers attended the Head Office in person. Integrates with PT. Lion Super Indo's SAP system for payment data, internal email notification services, centralized user administration, and DJP Indonesia APIs for tax document validation.",
      responsibilities: [
        "Built the frontend supplier portal using Next.js, ensuring a responsive and user-friendly experience",
        "Developed backend services using .NET Core Web API",
        "Implemented business logic using stored procedures and functions in PostgreSQL",
        "Integrated with PT. Lion Super Indo SAP APIs for supplier payment and transaction validation",
        "Integrated with DJP Indonesia APIs for tax document and tax transaction validation",
        "Integrated internal Email API with MongoDB for email and activity logging",
        "Implemented secure supplier access control and validation workflows",
      ],
      techStack: [
        "TypeScript",
        "Next JS",
        "NextUI",
        "Tailwind CSS",
        "Redux Toolkit",
        ".Net Core Web API",
        "Azure DevOps",
        "MongoDB",
        "Microsoft SQL Server",
        "PostgreSQL",
      ],
      teamSize: 2,
      periodStart: new Date("2024-01-08"),
      periodEnd: new Date("2024-08-30"),
      featured: true,
      order: 2,
      workExperienceId: diksha.id,
    },
  });
  await prisma.project.create({
    data: {
      title: "Ceisa 4.0 — Customs and Excise (Bea Cukai)",
      description:
        "CEISA (Customs-Excise Information System and Automation) 4.0 is a centralized, integrated, automated system by Indonesia's Directorate General of Customs and Excise, a core component of the national single window system. The Production Module tracks raw material mutations, finished goods, rejection/scrap reporting, and compliance auditing for companies under customs supervision.",
      responsibilities: [
        "Led frontend development for the Production Module: UI pattern design, template creation, and collaboration standards",
        "Defined API contracts and coordinated with a 3-person backend team for parallel development",
        "Acted as system analyst — gathering, clarifying, and explaining client requirements to the team",
        "Functioned as de facto project manager, keeping timelines and task coordination on track",
        "Developed core frontend features within a micro-frontend architecture",
        "Integrated Host-to-Host (H2H) Open API for data exchange with company ERP systems",
        "Mentored the frontend team on coding standards, UI consistency, and best practices",
      ],
      techStack: ["JavaScript", "React JS", "Ant Design", "React Router DOM", "Micro-Frontend", "Redux", "Keycloak Auth", "Axios"],
      teamSize: 20,
      periodStart: new Date("2023-07-01"),
      periodEnd: new Date("2024-01-02"),
      featured: true,
      order: 3,
      workExperienceId: nutech.id,
    },
  });
  await prisma.project.create({
    data: {
      title: "Tijeku Mobile App — Transjakarta",
      description:
        "Now officially launched as the Transjakarta app on Google Play Store, this public transportation app enhances the Jakarta commuter experience with journey planning, real-time bus tracking (up to 95% accuracy), digital ticket purchases via TJPay/AstraPay/QRIS Tap, route and stop information, and incident reporting.",
      responsibilities: [
        "Developed and maintained the app using React Native and React Native Paper",
        "Implemented journey planning, real-time bus tracking, digital ticketing, route info, and incident reporting",
        "Collaborated with backend developers to integrate real-time data and ticketing APIs",
        "Ensured smooth and responsive UI/UX across Android and iOS",
        "Conducted debugging, performance optimization, and maintenance for production deployment",
      ],
      techStack: ["TypeScript", "React Native", "React Native Paper", "React Native Navigation", "Redux Toolkit", "Expo", "Axios", "Socket.io"],
      teamSize: 5,
      periodStart: new Date("2023-03-01"),
      periodEnd: new Date("2023-07-01"),
      featured: true,
      order: 4,
      workExperienceId: nutech.id,
    },
  });
  await prisma.project.create({
    data: {
      title: "Smart Warehouse Mobile App — Telkom Akses",
      description:
        "Companion app for the Smart Warehouse Management System, focused on real-time monitoring of warehouse security and user authentication management. Provides real-time dashboards and notifications, map-based monitoring of warehouse locations and device status, and biometric/fingerprint and PIN credential registration linked to web-admin users.",
      responsibilities: [
        "Developed and maintained the mobile app with React Native for real-time warehouse monitoring",
        "Implemented biometric/fingerprint and PIN registration linked to web-admin users",
        "Integrated real-time monitoring using Socket.IO for device status updates and event notifications",
        "Ensured consistent UI/UX aligned with the web dashboards",
        "Supported warehouse staff in using the app and troubleshooting operational issues",
      ],
      techStack: ["TypeScript", "React Native", "Native Base", "Redux Toolkit", "Expo", "Axios", "Socket.io"],
      teamSize: 3,
      periodStart: new Date("2023-01-01"),
      periodEnd: new Date("2023-03-01"),
      order: 5,
      workExperienceId: nutech.id,
    },
  });
  await prisma.project.create({
    data: {
      title: "Smart Warehouse Management System — Telkom Akses",
      description:
        "Web application for configuration, real-time monitoring, and security management of warehouse facilities across Indonesia. Integrates IoT security devices — smart door locks with two-way verification (PIN + biometric), door/contact sensors, smoke detectors, siren strobe alarms, and Zigbee central hubs — with real-time dashboards, map-based visualization, and detailed security event logs powered by Socket.IO.",
      responsibilities: [
        "Developed and maintained the system using Next.js",
        "Implemented real-time monitoring with Socket.IO for live device status and security events",
        "Built monitoring dashboards, map visualization, and security logging features",
        "Implemented role-based access control (RBAC)",
        "Conducted technical training for field technicians and Telkom Akses regional heads",
        "Acted as Person in Charge (PIC) during team rotation; led onboarding of new team members",
      ],
      techStack: ["JavaScript", "Next JS", "Ant Design", "Redux Toolkit", "GitLab CI/CD", "Docker", "Kubernetes", "Axios", "Socket.io"],
      teamSize: 3,
      periodStart: new Date("2022-07-01"),
      periodEnd: new Date("2023-01-01"),
      order: 6,
      workExperienceId: nutech.id,
    },
  });
  await prisma.project.create({
    data: {
      title: "SITOLAUT — Ministry of Transportation",
      description:
        "Government web application supporting sea logistics management for the Ministry of Transportation of Indonesia. SITOLAUT Barang manages transactional and master data for goods transportation (ships, routes, regulatory flows); SITOLAUT Ternak handles livestock shipment management including mortality tracking and compliance.",
      responsibilities: [
        "Maintained and enhanced the SITOLAUT Barang and SITOLAUT Ternak web applications",
        "Developed frontend features using React.js with Bootstrap",
        "Collaborated with the System Analyst on business rules, logistics workflows, and regulatory requirements",
        "Fixed bugs and resolved production issues to ensure system stability",
      ],
      techStack: ["JavaScript", "React JS", "Bootstrap", "Redux"],
      teamSize: 5,
      periodStart: new Date("2022-03-01"),
      periodEnd: new Date("2022-07-01"),
      order: 7,
      workExperienceId: nutech.id,
    },
  });
  await prisma.project.create({
    data: {
      title: "Ticketing as a Service (TaaS) — DAMRI",
      description:
        "Proof of Concept web platform for a centralized employee transportation booking system connecting Bekasi City to the Jababeka Industrial Area. The TaaS Web Company application lets companies create, manage, and submit bulk transportation orders for their employees.",
      responsibilities: [
        "Developed TaaS Web Company, the web application for bulk employee transportation orders",
        "Built the frontend using Next.js, Bootstrap, and SCSS",
        "Implemented UI slicing from UI/UX team designs with responsive, consistent interfaces",
        "Coordinated with backend developers to integrate APIs and align data contracts",
        "Supported PoC demonstrations and feedback iterations with stakeholders",
      ],
      techStack: ["JavaScript", "Next JS", "Bootstrap", "SCSS", "Redux", "GitLab CI/CD", "Docker", "Kubernetes"],
      teamSize: 4,
      periodStart: new Date("2022-01-03"),
      periodEnd: new Date("2022-03-01"),
      order: 8,
      workExperienceId: nutech.id,
    },
  });

  console.log("Seeding education...");
  await prisma.education.create({
    data: {
      institution: "Institut Teknologi Budi Utomo",
      degree: "Bachelor of Computer Science",
      fieldOfStudy: "Computer Science",
      startYear: 2016,
      endYear: 2020,
      gpa: "3.85 / 4.00",
      description: "Graduated with The Best Student Predicate.",
      order: 0,
    },
  });

  console.log("Seeding skills...");
  const skills: { name: string; category: SkillCategory; proficiency: number }[] = [
    // Frontend
    { name: "React JS", category: "FRONTEND", proficiency: 95 },
    { name: "Next JS", category: "FRONTEND", proficiency: 95 },
    { name: "TypeScript", category: "FRONTEND", proficiency: 90 },
    { name: "JavaScript", category: "FRONTEND", proficiency: 95 },
    { name: "Tailwind CSS", category: "FRONTEND", proficiency: 90 },
    { name: "Ant Design", category: "FRONTEND", proficiency: 90 },
    { name: "Bootstrap", category: "FRONTEND", proficiency: 85 },
    { name: "Sass", category: "FRONTEND", proficiency: 80 },
    // Backend
    { name: "Node JS", category: "BACKEND", proficiency: 90 },
    { name: "Express JS", category: "BACKEND", proficiency: 90 },
    { name: "Nest JS", category: "BACKEND", proficiency: 80 },
    { name: ".Net Core API", category: "BACKEND", proficiency: 80 },
    { name: "PHP", category: "BACKEND", proficiency: 80 },
    { name: "CodeIgniter", category: "BACKEND", proficiency: 80 },
    { name: "Golang", category: "BACKEND", proficiency: 75 },
    { name: "Go Fiber", category: "BACKEND", proficiency: 75 },
    { name: "Python", category: "BACKEND", proficiency: 70 },
    // Database
    { name: "PostgreSQL", category: "DATABASE", proficiency: 85 },
    { name: "MySQL", category: "DATABASE", proficiency: 85 },
    { name: "MS SQL Server", category: "DATABASE", proficiency: 85 },
    { name: "MongoDB", category: "DATABASE", proficiency: 80 },
    { name: "ORM Prisma", category: "DATABASE", proficiency: 85 },
    { name: "ORM Sequelize", category: "DATABASE", proficiency: 85 },
    // DevOps
    { name: "Docker", category: "DEVOPS", proficiency: 85 },
    { name: "GitLab CI/CD", category: "DEVOPS", proficiency: 85 },
    { name: "Azure DevOps", category: "DEVOPS", proficiency: 75 },
    { name: "Ubuntu Server", category: "DEVOPS", proficiency: 80 },
    { name: "Windows Server", category: "DEVOPS", proficiency: 75 },
    // Mobile
    { name: "React Native", category: "MOBILE", proficiency: 85 },
    // Other
    { name: "Figma (UI/UX)", category: "OTHER", proficiency: 80 },
    { name: "AI", category: "OTHER", proficiency: 75 },
  ];
  await prisma.skill.createMany({
    data: skills.map((s, i) => ({ ...s, order: i })),
  });

  console.log("Seeding certificates...");
  const certificates: { title: string; issuer: string; kind?: CertificateKind }[] = [
    { title: "Frontend Web Developer Expert", issuer: "Dicoding" },
    { title: "Basic of AI (Artificial Intelligence)", issuer: "Dicoding" },
    { title: "Backend Application", issuer: "Dicoding" },
    { title: "Cloud Practitioner Essential (AWS)", issuer: "Dicoding" },
    { title: "Google Cloud Platform (GCP)", issuer: "Dicoding" },
    { title: "ACA (Alibaba Cloud Associate)", issuer: "Alibaba Cloud" },
    { title: "ACP (Alibaba Cloud Professional)", issuer: "Alibaba Cloud" },
    { title: "Fullstack Developer", issuer: "Bootcamp Dumbways" },
    { title: "Website Application Development", issuer: "Hacktiv8 Online Learning" },
    { title: "HTML, CSS, Javascript", issuer: "DTS (Digital Talent Scholarship)" },
    {
      title: "Global Denso Energy Saving Design Poster Competition (ASIA REGIONAL AWARD)",
      issuer: "DENSO CORPORATION",
      kind: "AWARD",
    },
  ];
  await prisma.certificate.createMany({
    data: certificates.map((c, i) => ({ ...c, order: i })),
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
