import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@tlc-andalusia.ma" },
    update: {},
    create: {
      email: "admin@tlc-andalusia.ma",
      password: hashedPassword,
      name: "TLC Admin",
      role: "admin",
    },
  });
  console.log("Admin user created:", admin.email);

  // Create programs
  const programs = await Promise.all([
    prisma.program.upsert({
      where: { slug: "kids-english" },
      update: {},
      create: {
        title: "Kids English",
        slug: "kids-english",
        description:
          "Fun and interactive English classes designed for young learners. Through games, songs, and creative activities, children build a strong foundation in English naturally.",
        ageGroup: "7-9 years",
        duration: "Trimester (20H) or Annual (60H)",
        levels: "Beginner, Elementary, Pre-Intermediate",
        objectives:
          "Basic vocabulary and expressions, listening comprehension, simple reading and writing, confidence in speaking English",
        icon: "Baby",
        active: true,
        sortOrder: 1,
      },
    }),
    prisma.program.upsert({
      where: { slug: "juniors-english" },
      update: {},
      create: {
        title: "Juniors English",
        slug: "juniors-english",
        description:
          "Engaging English program for juniors that develops all four language skills. Students learn through communicative activities, projects, and real-world topics.",
        ageGroup: "10-14 years",
        duration: "Trimester (20H) or Annual (60H)",
        levels: "Beginner to Intermediate",
        objectives:
          "Expanded vocabulary, grammar foundations, reading comprehension, writing skills, oral presentations",
        icon: "GraduationCap",
        active: true,
        sortOrder: 2,
      },
    }),
    prisma.program.upsert({
      where: { slug: "teens-english" },
      update: {},
      create: {
        title: "Teens English",
        slug: "teens-english",
        description:
          "Dynamic English courses for teenagers focusing on communication, academic skills, and real-world language use. Prepare for academic success and global communication.",
        ageGroup: "15-17 years",
        duration: "Trimester (20H) or Annual (60H)",
        levels: "Elementary to Upper-Intermediate",
        objectives:
          "Fluent communication, academic writing, critical thinking in English, presentation skills, exam readiness",
        icon: "Users",
        active: true,
        sortOrder: 3,
      },
    }),
    prisma.program.upsert({
      where: { slug: "adult-english" },
      update: {},
      create: {
        title: "Adult English",
        slug: "adult-english",
        description:
          "Comprehensive English courses for adults in a dynamic and motivating environment. Whether for career advancement, travel, or personal growth, our program adapts to your goals.",
        ageGroup: "18+ years",
        duration: "Trimester or Annual",
        levels: "Beginner to Advanced",
        objectives:
          "Professional communication, business English, conversational fluency, writing proficiency, cultural competence",
        icon: "Briefcase",
        active: true,
        sortOrder: 4,
      },
    }),
    prisma.program.upsert({
      where: { slug: "exam-preparation" },
      update: {},
      create: {
        title: "TOEFL / IELTS / TOEIC Preparation",
        slug: "exam-preparation",
        description:
          "Intensive preparation courses for internationally recognized English proficiency exams. Expert guidance from our TOEFL-IELTS-TOEIC specialist with 7+ years of experience.",
        ageGroup: "16+ years",
        duration: "30 hours",
        levels: "Intermediate to Advanced",
        objectives:
          "Test-taking strategies, practice tests, score improvement, time management, all exam sections coverage",
        icon: "Award",
        active: true,
        sortOrder: 5,
      },
    }),
    prisma.program.upsert({
      where: { slug: "conversation-classes" },
      update: {},
      create: {
        title: "Conversation Classes",
        slug: "conversation-classes",
        description:
          "Practice-focused classes designed to boost your speaking confidence. Engage in real conversations, debates, and discussions in a supportive environment.",
        ageGroup: "15+ years",
        duration: "Flexible",
        levels: "Pre-Intermediate to Advanced",
        objectives:
          "Speaking fluency, pronunciation improvement, natural expressions, active listening, spontaneous communication",
        icon: "MessageCircle",
        active: true,
        sortOrder: 6,
      },
    }),
    prisma.program.upsert({
      where: { slug: "french-program" },
      update: {},
      create: {
        title: "French - Examen Régional Preparation",
        slug: "french-program",
        description:
          "Préparation complète à l'examen régional du bac – Épreuve de Français. Comprehensive preparation for the regional French exam.",
        ageGroup: "15-18 years",
        duration: "30 hours",
        levels: "Baccalauréat level",
        objectives:
          "Exam techniques, essay writing, reading comprehension, literary analysis, grammar mastery",
        icon: "BookOpen",
        active: true,
        sortOrder: 7,
      },
    }),
    prisma.program.upsert({
      where: { slug: "arabic-program" },
      update: {},
      create: {
        title: "Arabic - Examen Régional Preparation",
        slug: "arabic-program",
        description:
          "تحضير شامل لمادة اللغة العربية - استعدّ للإمتحان الجهوي للبكالوريا. Complete preparation for the regional Arabic baccalauréat exam.",
        ageGroup: "15-18 years",
        duration: "30 hours",
        levels: "Baccalauréat level",
        objectives:
          "Exam preparation, essay writing, reading comprehension, grammar, literary analysis in Arabic",
        icon: "Languages",
        active: true,
        sortOrder: 8,
      },
    }),
    prisma.program.upsert({
      where: { slug: "italian-program" },
      update: {},
      create: {
        title: "Italian Language",
        slug: "italian-program",
        description:
          "Parla l'Italiano con noi! Learn Italian with a native instructor in a fun and interactive atmosphere. Small effective groups.",
        ageGroup: "All ages",
        duration: "3 hours/week",
        levels: "Beginner to Intermediate",
        objectives:
          "Conversational Italian, basic grammar, cultural immersion, pronunciation, everyday expressions",
        icon: "Globe",
        active: true,
        sortOrder: 9,
      },
    }),
  ]);
  console.log(`Created ${programs.length} programs`);

  // Create groups
  const groups = await Promise.all([
    prisma.group.create({
      data: {
        name: "Kids A - Morning",
        programId: programs[0].id,
        level: "Beginner",
        schedule: "Saturday & Sunday 9h-11h",
        teacher: "Sabik Youness",
        capacity: 12,
      },
    }),
    prisma.group.create({
      data: {
        name: "Juniors A - Afternoon",
        programId: programs[1].id,
        level: "Beginner",
        schedule: "Monday & Wednesday 17h-19h",
        teacher: "Sabik Youness",
        capacity: 15,
      },
    }),
    prisma.group.create({
      data: {
        name: "Juniors B - Afternoon",
        programId: programs[1].id,
        level: "Elementary",
        schedule: "Tuesday & Thursday 17h-19h",
        teacher: "Sabik Youness",
        capacity: 15,
      },
    }),
    prisma.group.create({
      data: {
        name: "Adults A - Afternoon",
        programId: programs[3].id,
        level: "Intermediate",
        schedule: "Monday & Wednesday 17h-19h",
        teacher: "Sabik Youness",
        capacity: 15,
      },
    }),
  ]);
  console.log(`Created ${groups.length} groups`);

  // Create sample students
  const students = await Promise.all([
    prisma.student.create({
      data: {
        studentId: "TLC250001",
        firstName: "Youssef",
        lastName: "El Amrani",
        dateOfBirth: new Date("2015-03-15"),
        phone: "0612345678",
        parentPhone: "0698765432",
        programId: programs[0].id,
        level: "Beginner",
        groupId: groups[0].id,
        status: "active",
      },
    }),
    prisma.student.create({
      data: {
        studentId: "TLC250002",
        firstName: "Salma",
        lastName: "Benkirane",
        dateOfBirth: new Date("2012-07-22"),
        phone: "0623456789",
        parentPhone: "0687654321",
        programId: programs[1].id,
        level: "Beginner",
        groupId: groups[1].id,
        status: "active",
      },
    }),
    prisma.student.create({
      data: {
        studentId: "TLC250003",
        firstName: "Omar",
        lastName: "Tazi",
        dateOfBirth: new Date("2011-11-05"),
        phone: "0634567890",
        parentPhone: "0676543210",
        programId: programs[1].id,
        level: "Elementary",
        groupId: groups[2].id,
        status: "active",
      },
    }),
    prisma.student.create({
      data: {
        studentId: "TLC250004",
        firstName: "Amina",
        lastName: "Rachidi",
        dateOfBirth: new Date("1995-01-20"),
        email: "amina.r@email.com",
        phone: "0645678901",
        programId: programs[3].id,
        level: "Intermediate",
        groupId: groups[3].id,
        status: "active",
      },
    }),
    prisma.student.create({
      data: {
        studentId: "TLC250005",
        firstName: "Karim",
        lastName: "Fassi",
        dateOfBirth: new Date("1998-09-12"),
        email: "karim.f@email.com",
        phone: "0656789012",
        programId: programs[4].id,
        level: "Intermediate",
        status: "active",
      },
    }),
  ]);
  console.log(`Created ${students.length} students`);

  // Create exam sessions
  const examSessions = await Promise.all([
    prisma.examSession.create({
      data: {
        title: "Spring 2026 - Kids Final Exam",
        programId: programs[0].id,
        groupId: groups[0].id,
        level: "Beginner",
        examDate: new Date("2026-06-15"),
        teacher: "Sabik Youness",
        status: "upcoming",
      },
    }),
    prisma.examSession.create({
      data: {
        title: "Spring 2026 - Juniors A Exam",
        programId: programs[1].id,
        groupId: groups[1].id,
        level: "Beginner",
        examDate: new Date("2026-06-16"),
        teacher: "Sabik Youness",
        status: "upcoming",
      },
    }),
    prisma.examSession.create({
      data: {
        title: "Winter 2026 - Juniors B Exam",
        programId: programs[1].id,
        groupId: groups[2].id,
        level: "Elementary",
        examDate: new Date("2026-03-20"),
        teacher: "Sabik Youness",
        status: "completed",
      },
    }),
  ]);
  console.log(`Created ${examSessions.length} exam sessions`);

  // Create exam results (for completed exam)
  const results = await Promise.all([
    prisma.examResult.create({
      data: {
        studentId: students[2].id,
        examSessionId: examSessions[2].id,
        score: 85,
        maxScore: 100,
        percentage: 85,
        status: "passed",
        teacherComment:
          "Excellent progress! Omar shows strong comprehension skills and improved speaking confidence.",
        certificateAvailable: true,
      },
    }),
  ]);
  console.log(`Created ${results.length} exam results`);

  // Create testimonials
  const testimonials = await Promise.all([
    prisma.testimonial.create({
      data: {
        name: "Fatima Zahra B.",
        role: "Parent of Kids Student",
        content:
          "My daughter has been attending TLC for 6 months and the improvement is incredible. She now speaks English with confidence and actually enjoys learning. The teachers are amazing!",
        rating: 5,
        sortOrder: 1,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Ahmed M.",
        role: "Adult Student",
        content:
          "The communicative approach at TLC is exactly what I needed. After years of grammar-only classes elsewhere, I can finally hold conversations in English. Highly recommended!",
        rating: 5,
        sortOrder: 2,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Khadija R.",
        role: "TOEFL Student",
        content:
          "I scored 95 on my TOEFL thanks to the preparation at TLC. Mr. Sabik's expertise and teaching methodology made all the difference. Professional and effective!",
        rating: 5,
        sortOrder: 3,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Mohamed E.",
        role: "Parent of Juniors Student",
        content:
          "The small group sizes and personalized attention at TLC make it stand out. My son's English has improved dramatically, and he looks forward to every class.",
        rating: 5,
        sortOrder: 4,
      },
    }),
  ]);
  console.log(`Created ${testimonials.length} testimonials`);

  // Create FAQ items
  const faqs = await Promise.all([
    prisma.fAQ.create({
      data: {
        question: "What age groups do you accept?",
        answer:
          "We welcome students of all ages! Our programs are divided into Kids (7-9 years), Juniors (10-14 years), Teens (15-17 years), and Adults (18+). We also offer exam preparation courses for students 16 and above.",
        category: "General",
        sortOrder: 1,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: "How long are the courses?",
        answer:
          "Our regular English courses run on a trimester basis (20 hours per trimester) or annually (60 hours covering 3 levels). Exam preparation courses (TOEFL/IELTS/TOEIC, Examen Régional) are 30-hour intensive programs. Italian classes run 3 hours per week.",
        category: "Programs",
        sortOrder: 2,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: "What are the class schedules?",
        answer:
          "Morning classes: Saturday & Sunday 9h-11h. Afternoon classes: Monday to Thursday 17h-19h. Specific schedules depend on the program and group. Contact us for the current schedule.",
        category: "Programs",
        sortOrder: 3,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: "How much do courses cost?",
        answer:
          "Kids: 1,100 MAD/trimester (20H) or 3,100 MAD/year (3 levels, 60H). Juniors: 1,000 MAD/trimester (20H) or 2,800 MAD/year (3 levels, 60H). Exam preparation courses: 1,200 MAD (30H). Administrative fees: 100 MAD registration + 100 MAD placement test.",
        category: "Payment",
        sortOrder: 4,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: "Is there a placement test?",
        answer:
          "Yes! All new students take a placement test to determine their current level. This ensures you're placed in the right group for optimal learning. The test fee is 100 MAD.",
        category: "General",
        sortOrder: 5,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: "How can I check my exam results?",
        answer:
          "Visit our Exam Results page on this website. Enter your Student ID and date of birth to securely view your results, including score, percentage, and teacher comments.",
        category: "Exams",
        sortOrder: 6,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: "Do you offer certificates?",
        answer:
          "Yes, students who successfully complete their program and pass the final exam receive a certificate of completion from TLC by Andalusia Academy. TOEFL/IELTS/TOEIC preparation students receive their official scores from the respective testing organizations.",
        category: "Exams",
        sortOrder: 7,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: "What is the maximum class size?",
        answer:
          "We maintain small groups of maximum 12-15 students to ensure personalized attention and maximum speaking practice for every student.",
        category: "Programs",
        sortOrder: 8,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: "Can I change my schedule after enrollment?",
        answer:
          "Yes, schedule changes are possible subject to availability. A fee of 100 MAD applies for schedule or time changes after the first 36 hours of class.",
        category: "Registration",
        sortOrder: 9,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: "Where are you located?",
        answer:
          "TLC by Andalusia Academy is located at Rue Prestige Targa 1, Marrakech. You can visit our front desk or call us at 0643 43 43 82.",
        category: "General",
        sortOrder: 10,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: "What teaching methodology do you use?",
        answer:
          "We use the communicative approach, focusing on real-life communication rather than just grammar rules. Students learn English the natural way through speaking, listening, reading, and writing in authentic contexts.",
        category: "Programs",
        sortOrder: 11,
      },
    }),
    prisma.fAQ.create({
      data: {
        question: "How do I register?",
        answer:
          "You can register by visiting our center at Rue Prestige Targa 1, Marrakech, contacting us via WhatsApp at 0643 43 43 82, or filling out the registration form on our Contact page. Registration is open throughout the year.",
        category: "Registration",
        sortOrder: 12,
      },
    }),
  ]);
  console.log(`Created ${faqs.length} FAQ items`);

  // Create site settings
  const settings = [
    { key: "site_name", value: "TLC by Andalusia Academy", type: "text" },
    { key: "tagline", value: "English, The Natural Way", type: "text" },
    { key: "phone", value: "0643 43 43 82", type: "text" },
    { key: "email", value: "tlc@andalusiaacademy.ma", type: "text" },
    {
      key: "address",
      value: "Rue Prestige Targa 1, Marrakech",
      type: "text",
    },
    { key: "whatsapp", value: "212643434382", type: "text" },
    {
      key: "instagram",
      value: "https://instagram.com/tlc_by_andalusia",
      type: "text",
    },
    { key: "facebook", value: "https://facebook.com/tlcbyandalusia", type: "text" },
    {
      key: "morning_schedule",
      value: "Saturday & Sunday: 9h - 11h",
      type: "text",
    },
    {
      key: "afternoon_schedule",
      value: "Monday to Thursday: 17h - 19h",
      type: "text",
    },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log(`Created ${settings.length} site settings`);

  // Create sample gallery images (placeholder URLs)
  const galleryImages = await Promise.all([
    prisma.galleryImage.create({
      data: {
        url: "/images/gallery/placeholder-1.jpg",
        caption: "Students in class",
        category: "Classes",
        sortOrder: 1,
      },
    }),
    prisma.galleryImage.create({
      data: {
        url: "/images/gallery/placeholder-2.jpg",
        caption: "TLC Center entrance",
        category: "Campus",
        sortOrder: 2,
      },
    }),
    prisma.galleryImage.create({
      data: {
        url: "/images/gallery/placeholder-3.jpg",
        caption: "Group activity",
        category: "Activities",
        sortOrder: 3,
      },
    }),
    prisma.galleryImage.create({
      data: {
        url: "/images/gallery/placeholder-4.jpg",
        caption: "Certificate ceremony",
        category: "Events",
        sortOrder: 4,
      },
    }),
    prisma.galleryImage.create({
      data: {
        url: "/images/gallery/placeholder-5.jpg",
        caption: "Kids English class",
        category: "Classes",
        sortOrder: 5,
      },
    }),
    prisma.galleryImage.create({
      data: {
        url: "/images/gallery/placeholder-6.jpg",
        caption: "International Women's Day celebration",
        category: "Events",
        sortOrder: 6,
      },
    }),
  ]);
  console.log(`Created ${galleryImages.length} gallery images`);

  // Create sample registrations
  const registrations = await Promise.all([
    prisma.registration.create({
      data: {
        firstName: "Nadia",
        lastName: "Haddaoui",
        email: "nadia.h@email.com",
        phone: "0667890123",
        parentName: "Hassan Haddaoui",
        parentPhone: "0678901234",
        programInterest: "Kids English",
        message: "My daughter is 8 years old and interested in starting English classes.",
        status: "new",
      },
    }),
    prisma.registration.create({
      data: {
        firstName: "Rachid",
        lastName: "Alami",
        email: "rachid.a@email.com",
        phone: "0689012345",
        programInterest: "TOEFL Preparation",
        message: "I need to prepare for TOEFL. When is the next session?",
        status: "contacted",
        adminNotes: "Called back, interested in June session",
      },
    }),
  ]);
  console.log(`Created ${registrations.length} registrations`);

  console.log("\nDatabase seeded successfully!");
  console.log("\nAdmin credentials:");
  console.log("  Email: admin@tlc-andalusia.ma");
  console.log("  Password: admin123");
  console.log("\nSample student for result checking:");
  console.log("  Student ID: TLC250003");
  console.log("  Date of Birth: 2011-11-05");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
