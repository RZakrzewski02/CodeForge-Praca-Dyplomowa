(function () {
  const row = document.querySelector('.row.h-100');
  const openRegister = document.querySelector('#openRegister');
  const openLogin = document.querySelector('#openLogin');

  const loginForm = document.querySelector('.form-card form');
  const registerForm = document.querySelector('.register-card form');

  if (!row) return;

  
  // Kliknięcie "Zarejestruj się" (Przełącz na rejestrację)
  if (openRegister) {
    openRegister.addEventListener('click', (e) => {
      e.preventDefault();
      row.classList.add('swapped');
      
      setTimeout(() => {
        document.querySelector('.register-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    });
  }

  // Kliknięcie "Zaloguj się" (Przełącz na logowanie)
  if (openLogin) {
    openLogin.addEventListener('click', (e) => {
      e.preventDefault();
      row.classList.remove('swapped');
      
      setTimeout(() => {
        document.querySelector('.form-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    });
  }

  // --- 4. LOGIKA API (Komunikacja z Back-endem) ---

  // A. Obsługa REJESTRACJI
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Zatrzymuje przeładowanie strony

      // Pobieramy dane z inputów (wg ID z Twojego HTML)
      const name = document.getElementById('RegName').value;
      const email = document.getElementById('RegEmail').value;
      const password = document.getElementById('RegPassword').value;

      try {
        // Wysyłamy dane do endpointu, który stworzyliśmy w routes/auth.js
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
          alert('Sukces: ' + data.message);
          
          // UX TRICK: Po udanej rejestracji automatycznie klikamy "Zaloguj się",
          // żeby animacja wróciła do panelu logowania
          if (openLogin) openLogin.click();
          
          // Opcjonalnie czyścimy formularz rejestracji
          registerForm.reset(); 
        } else {
          alert('Błąd rejestracji: ' + data.message);
        }
      } catch (err) {
        console.error(err);
        alert('Wystąpił błąd połączenia z serwerem.');
      }
    });
  }

  // B. Obsługa LOGOWANIA
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('LoginEmail').value;
      const password = document.getElementById('LoginPassword').value;

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = '/main';
        } else {
          alert('Błąd logowania: ' + data.message);
        }
      } catch (err) {
        console.error(err);
        alert('Wystąpił błąd połączenia z serwerem.');
      }
    });
  }

})();