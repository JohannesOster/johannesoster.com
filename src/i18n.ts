type Language = "en" | "de";

interface Translation {
  en: string;
  de: string;
  html?: boolean;
}

interface Translations {
  [key: string]: Translation;
}

const translations: Translations = {
  greeting: {
    en: "Hi, I'm Johannes!",
    de: "Grüße, ich bin Johannes!",
  },
  bio: {
    en: `I'm based in Vienna, the Lead AI Engineer at <a href="https://became.ai" target="_blank" rel="noopener noreferrer">Became AI</a>, 🎓 part of the lecture <span class="highlight">Generative AI</span> at TU Wien, 🎤 <a href="https://youtu.be/7Iq3p22TauA?t=516" target="_blank" rel="noopener noreferrer">give talks</a> and 📖 <a href="https://www.picus.at/produkt/die-eloquenz-der-computer/" target="_blank" rel="noopener noreferrer">write</a> about generative AI.`,
    de: `Ich lebe in Wien, bin Lead AI Engineer bei <a href="https://became.ai" target="_blank" rel="noopener noreferrer">Became AI</a>, 🎓 Teil der Lehrveranstaltung <span class="highlight">Generative AI</span> an der TU Wien, 🎤 <a href="https://youtu.be/7Iq3p22TauA?t=516" target="_blank" rel="noopener noreferrer">halte Vorträge</a> und 📖 <a href="https://www.picus.at/produkt/die-eloquenz-der-computer/" target="_blank" rel="noopener noreferrer">schreibe</a> über generative KI.`,
    html: true,
  },
  contact: {
    en: "contact(at)johannesoster.com",
    de: "contact(at)johannesoster.com",
  },
  privacyLink: {
    en: "Privacy Policy",
    de: "Datenschutz",
  },
  privacyTitle: {
    en: "Privacy Policy",
    de: "Datenschutzerklärung",
  },
  privacyParagraph1: {
    en: "This website does not collect, store, or process any personal data. I do not track user activity, use analytics tools or third-party trackers. We do not store any IP addresses or other identifiable data.",
    de: "Diese Website erhebt, speichert oder verarbeitet keine personenbezogenen Daten. Ich verfolge keine Nutzeraktivitäten, verwende keine Analysetools oder Tracker von Drittanbietern. Wir speichern keine IP-Adressen oder andere identifizierbare Daten.",
  },
  privacyParagraph2: {
    en: "If you contact me by email, your message will only be used to respond to your inquiry and will not be shared with any third parties.",
    de: "Wenn Sie mich per E-Mail kontaktieren, wird Ihre Nachricht ausschließlich zur Beantwortung Ihrer Anfrage verwendet und nicht an Dritte weitergegeben.",
  },
  backToHome: {
    en: "Back to home",
    de: "Zurück zur Startseite",
  },
  impressumLink: {
    en: "Legal Notice",
    de: "Impressum",
  },
  impressumTitle: {
    en: "Legal Notice",
    de: "Impressum",
  },
  impressumContact: {
    en: "Contact",
    de: "Kontakt",
  },
  impressumName: {
    en: "Name: Johannes Oster",
    de: "Name: Johannes Oster",
  },
  impressumAddress: {
    en: "Address: Bendlgasse 31 Top 18, 1120 Vienna",
    de: "Anschrift: Bendlgasse 31 Top 18, 1120 Wien",
  },
  impressumEmail: {
    en: "Email: contact(at)johannesoster.com",
    de: "E-Mail-Adresse: contact(at)johannesoster.com",
  },
  impressumLiabilityNotice: {
    en: "Liability Notice",
    de: "Haftungshinweis",
  },
  impressumExternalLinks: {
    en: "Liability for External Links",
    de: "Haftung für externe Links",
  },
  impressumExternalLinksText: {
    en: "This website contains links to external third-party websites over whose content I have no influence. Therefore, I cannot accept any liability for this external content. The respective provider or operator of the pages is always responsible for the content of the linked pages.",
    de: "Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.",
  },
  impressumContent: {
    en: "Liability for Content",
    de: "Haftung für Inhalte",
  },
  impressumContentText: {
    en: "The content of this website is created and maintained with the utmost care. However, I cannot assume liability for the correctness of all content on this website. Should you notice any problematic or unlawful content, please contact me using the contact details provided above.",
    de: "Die Inhalte dieser Website werden mit größtmöglicher Sorgfalt erstellt, und weiterentwickelt. Dennoch können wir keine Haftung für die Korrektheit aller Inhalte auf dieser Webseite übernehmen. Sollten Ihnen problematische oder rechtswidrige Inhalte auffallen kontaktieren Sie bitte die oben angegebenen Kontaktdaten.",
  },
};

const STORAGE_KEY = "preferred-language";

export function getStoredLanguage(): Language {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "de") return stored;

  // Detect browser language
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith("de") ? "de" : "en";
}

export function setLanguage(lang: Language): void {
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;

  // Update all translatable elements
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key && translations[key]) {
      if (translations[key].html) {
        el.innerHTML = translations[key][lang];
      } else {
        el.textContent = translations[key][lang];
      }
    }
  });

  // Update toggle button state
  updateToggleState(lang);
}

function updateToggleState(lang: Language): void {
  const toggle = document.querySelector(".lang-toggle");
  if (toggle) {
    toggle.setAttribute("data-lang", lang);
  }
}

export function initI18n(): void {
  const lang = getStoredLanguage();
  setLanguage(lang);

  // Set up toggle listener
  const toggle = document.querySelector(".lang-toggle");
  toggle?.addEventListener("click", () => {
    const currentLang = (localStorage.getItem(STORAGE_KEY) as Language) || "en";
    const newLang: Language = currentLang === "en" ? "de" : "en";
    setLanguage(newLang);
  });
}
