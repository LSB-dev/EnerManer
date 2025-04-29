import { PlantData } from '../types';

export const generateEmailContent = (plant: PlantData) => {
  const subject = `Energieverbrauchsdaten angefordert - ${plant.name}`;
  
  const body = `Sehr geehrte(r) ${plant.contact.name},

wir bitten Sie um die Übermittlung der aktuellen Energieverbrauchsdaten für ${plant.name}.

Bitte nutzen Sie den folgenden Link zur sicheren Eingabe der Daten:
${plant.submissionLink}

Der Link ist aus Sicherheitsgründen nur 24 Stunden gültig.

Mit freundlichen Grüßen
Ihr EnerManer Team`;

  return {
    subject: encodeURIComponent(subject),
    body: encodeURIComponent(body)
  };
};

export const openEmailClient = (plant: PlantData) => {
  const { subject, body } = generateEmailContent(plant);
  window.location.href = `mailto:${plant.contact.email}?subject=${subject}&body=${body}`;
};