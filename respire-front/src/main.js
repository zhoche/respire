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
    form.addEventListener('submit', async (e) => {
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
    

    // Désactiver le bouton pendant l’envoi
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    feedback.textContent = 'Envoi en cours…';
    feedback.style.color = 'inherit';

    try {
    const payload = {
        firstname: form.firstname.value.trim(),
        lastname:  form.lastname.value.trim(),
        email:     form.email.value.trim(),
        phone:     form.phone.value.trim(),
        offer:     form.offer.value,
        message:   form.message.value.trim(),
    };

    const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5050';

    const resp = await fetch(`${API}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await resp.json();

    if (!resp.ok) {
        // erreurs renvoyées par l’API (400…)
        if (data?.errors) {
        // afficher les erreurs sous les champs
        Object.entries(data.errors).forEach(([key, msg]) => {
            const el = form[key];
            if (!el) return;
            const field = el.closest('.field');
            if (!field) return;
            field.classList.add('is-error');
            let err = field.querySelector('.error');
            if (!err) {
            err = document.createElement('p');
            err.className = 'error';
            field.appendChild(err);
            }
            err.textContent = msg;
        });
        }
        throw new Error(data?.message || 'Erreur côté serveur.');
    }

    // Succès
    feedback.textContent = data?.message || 'Votre message a bien été envoyé ✅';
    feedback.style.color = 'green';
    form.reset();

    } catch (err) {
    feedback.textContent = 'Une erreur est survenue lors de l’envoi ❌';
    feedback.style.color = '#b3261e';
    console.error(err);

    } finally {
    submitBtn.disabled = false;
    submitBtn.removeAttribute('aria-busy');
    }

    });
  });
  