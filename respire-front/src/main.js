import './styles/base.css';
import './styles/header.css';
import './styles/hero.css';
import './styles/about.css';
import './styles/metrics.css';
import './styles/courses.css';
import './styles/banner.css';
import './styles/pricing.css';
import './styles/contact.css';
import './styles/footer.css';


window.addEventListener('DOMContentLoaded', () => { 
    const form = document.getElementById('contact-form');
    if (!form) return;
  
    const feedback = document.getElementById('form-feedback');
  
    // Référence des champs (el-> element) + règles
    const fields = {
      firstname: { el: form.firstname, required: true, min: 2, label: 'Prénom' },
      lastname:  { el: form.lastname,  required: true, min: 2, label: 'Nom' },
      email:     { el: form.email,     required: true, type: 'email', label: 'Email' },
      phone:     { el: form.phone,     required: false, pattern: /^(\+33|0)[1-9](\d{2}){4}$/, label: 'Téléphone' },
      offer:     { el: form.offer,     required: false, label: 'Offre' },
      message:   { el: form.message,   required: true, min: 10, label: 'Message' },
    };
  

    // Afficher/retirer une erreur sous un champ
    function setError(input, msg) {
      const field = input.closest('.field');
      if (!field) return;
      field.classList.add('is-error'); // ajoute une classe CSS pour le style
      input.setAttribute('aria-invalid', 'true'); // accessibilité
      let err = field.querySelector('.error');
      if (!err) {
        err = document.createElement('p');
        err.className = 'error';
        field.appendChild(err);
      }
      err.textContent = msg;
    }
  
    function clearError(input) {
      const field = input.closest('.field');
      if (!field) return;
      field.classList.remove('is-error');
      input.removeAttribute('aria-invalid');
      const err = field.querySelector('.error');
      if (err) err.textContent = '';
    }
  
    // Validation email simple
    function isEmailValid(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }
  
    // Validation d'un champ
    function validateField(key) {
      const r = fields[key];
      const el = r.el;
      const val = (el.value || '').trim();
  
      // requis
      if (r.required && !val) {
        setError(el, `${r.label} est requis.`);
        return false;
      }
  
      // min length
      if (val && r.min && val.length < r.min) {
        setError(el, `${r.label} doit contenir au moins ${r.min} caractères.`);
        return false;
      }
  
      // email
      if (val && r.type === 'email' && !isEmailValid(val)) {
        setError(el, `Veuillez saisir un email valide.`);
        return false;
      }
  
      // pattern (téléphone FR optionnel)
      if (val && r.pattern && !r.pattern.test(val.replace(/\s/g, ''))) {
        setError(el, `Format de ${r.label} invalide.`);
        return false;
      }
  
      clearError(el);
      return true;
    }
  
    
    // Validation au fil de la saisie
    Object.keys(fields).forEach(key => {
      const el = fields[key].el;
      if (!el) return;
      el.addEventListener('input', () => validateField(key)); // pendant qu’on tape
      el.addEventListener('blur', () => validateField(key)); // quand on sort du champ
    });
  



    // Soumission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      feedback.textContent = '';
      let firstInvalid = null;
      let ok = true;
  
      for (const key of Object.keys(fields)) {
        const valid = validateField(key);
        if (!valid && !firstInvalid) firstInvalid = fields[key].el;
        ok = ok && valid;
      }
  
      if (!ok) {
        feedback.textContent = 'Merci de corriger les champs en rouge.';
        feedback.style.color = '#b3261e';
        firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid?.focus({ preventScroll: true });
        return;
      }
  
      // Ici on n’envoie pas encore (étape suivante)
      feedback.textContent = 'Formulaire valide ✅ (prêt pour l’envoi au serveur)';
      feedback.style.color = 'green';
    });
  });
  