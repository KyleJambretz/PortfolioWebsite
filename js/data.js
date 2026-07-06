const SITE = {

  name: "Kyle Jambretz",
  role: "Computer Science Student - SNHU",

  taglines: [
    "I build and break infrastructure.",
    "Systems. Networks. Automation.",
    "If it has a shell, I'm at home.",
    "Uptime is my love language.",
  ],

  terminal: [
    {
      cmd: "whoami",
      out: ["Kyle — Student and lifelong tinkerer."]
    },
    {
      cmd: "cat about.txt",
      out: [
        "I tinker across the full IT stack: hardware, networking,",
        "servers, scripting, and software development.",
        "I like solving problems nobody else wants to touch,",
        "automating the boring stuff, and learning new tools."
      ]
    },
    {
      cmd: "ls ./interests",
      out: ["homelab/  automation/  game-dev/  3d-graphics/"]
    },
    {
      cmd: "uptime",
      out: ["up 8+ years of curiosity"]
    }
  ],

  stats: [
    { value: 8,  suffix: "+", label: "Years Tinkering" },
    { value: 3,  suffix: "+", label: "Projects Shipped" },
    { value: 1,   suffix: "",  label: "Homelab Servers" },
    { value: 100,  suffix: "%", label: " Obsession" }
  ],

  skillGroups: [
    {
      title: "Systems & Infrastructure",
      skills: [
        "Windows Server",
        "Linux Administration",
        "Virtualization (Hyper-V)",
        "Networking (TCP/IP, VLANs, Firewalls)"
      ]
    },
    {
      title: "Development & Automation",
      skills: [
        "C++",
        "Python",
        "C# / .NET",
        "Web (HTML/CSS/JS)"
      ]
    },
    {
      title: "Tools & Platforms",
      skills: [
        "Docker / Containers",
        "Git",
        "Unity",
        "Blender"
      ]
    }
  ],

  projects: [
    {
      icon: "🖥️",
      title: "Application Tracker",
      description: "Web page where you can add listings of each application you made, and update their statuses.",
      tags: ["HTML", "CSS", "JavaScript"],
      link: "https://github.com/KyleJambretz/ApplicationTracker"
    },
    {
      icon: "🎮",
      title: "3D Game Template",
      description: "A reusable Unity template with custom toon shaders, GPU-instanced foliage, dynamic weather, and a full day/night cycle including a FPS player controller with headbob mechanics.",
      tags: ["Unity", "C#", "Shaders", "URP"],
      link: ""
    },
    {
      icon: "🌐",
      title: "This Website",
      description: "Hand-built portfolio with zero frameworks — canvas particle physics, custom cursor, and scroll-driven animation in vanilla JS.",
      tags: ["HTML", "CSS", "JavaScript", "Canvas"],
      link: ""
    },
    {
      icon: "🏢",
      title: "Business Inventory System",
      description: "A small business local inventory system that works on events/history rather than variable mutation.",
      tags: [".NET 10.0", "C#", "WPF", "XAML"],
      link: "https://github.com/KyleJambretz/BusinessInventorySystem"
    }
  ],

  timeline: [
    {
      period: "2020 — 2021",
      title: "Software Developer Intern",
      place: "Medical Numerics Inc. - Textron (No Longer In Business)",
      points: [
        "Created a Python Flask endpoint server for medical image processing.",
        "Participated in team meetings.",
      ]
    },
    {
      period: "2020 — 2021",
      title: "Help Desk Intern",
      place: "Mukwonago Area School District",
      points: [
        "Front-line support for hardware, software, and network issues.",
        "Resolved tickets based on priority and speed.",
      ]
    },
    {
      period: "2015 — 2020",
      title: "The Homelab Years",
      place: "Self-taught",
      points: [
        "Broke things on purpose to learn how to fix them.",
        "Built way too many side projects, classically never finishing them."
      ]
    }
  ],

  contact: {
    heading: "Still here?",
    blurb: "Whether it's infrastructure, automation, or something weirder I always love a learning opportunity. The fastest way to reach me:",
    email: "kylejambretz@gmail.com",
    links: [
      { label: "GitHub",   url: "https://github.com/kylejambretz" },
      { label: "LinkedIn", url: "https://linkedin.com/in/kylejambretz" }
    ]
  },

  footer: "Designed & built from scratch. No frameworks were harmed."
};
