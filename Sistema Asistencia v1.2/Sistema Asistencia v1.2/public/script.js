document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const entryButton = document.getElementById('entry');
    const exitButton = document.getElementById('exit');
    const logoutButton = document.getElementById('logout');
    const reportsDiv = document.getElementById('reports');
    const createUserForm = document.getElementById('create-user-form');
    const updateUserForm = document.getElementById('update-user-form');
    const deleteUserForm = document.getElementById('delete-user-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                if (response.ok) {
                    window.localStorage.setItem('userId', data.id);
                    window.localStorage.setItem('role', data.role);
                    window.location.href = data.role === 'admin' ? 'admin.html' : 'employee.html';
                } else {
                    document.getElementById('login-error').textContent = 'Credenciales inválidas.';
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    if (entryButton) {
        entryButton.addEventListener('click', async () => {
            const userId = window.localStorage.getItem('userId');
            try {
                const response = await fetch('/attendance/entry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId })
                });
                const data = await response.json();
                if (response.ok) {
                    document.getElementById('message').textContent = `Entrada registrada correctamente: ${data.date} ${data.time}`;
                } else {
                    document.getElementById('message').textContent = 'Error al registrar entrada.';
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    if (exitButton) {
        exitButton.addEventListener('click', async () => {
            const userId = window.localStorage.getItem('userId');
            try {
                const response = await fetch('/attendance/exit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId })
                });
                const data = await response.json();
                if (response.ok) {
                    document.getElementById('message').textContent = `Salida registrada correctamente: ${data.date} ${data.time}`;
                } else {
                    document.getElementById('message').textContent = 'Error al registrar salida.';
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            window.localStorage.removeItem('userId');
            window.localStorage.removeItem('role');
            window.location.href = 'index.html';
        });
    }

    if (reportsDiv) {
        document.getElementById('report-late').addEventListener('click', async () => {
            try {
                const response = await fetch('/report/late-entries');
                const data = await response.json();
                reportsDiv.innerHTML = `<h2>Entradas Tardías</h2>${data.map(entry => `<p>${entry.email}: ${new Date(entry.timestamp).toLocaleString()}</p>`).join('')}`;
            } catch (error) {
                console.error('Error:', error);
            }
        });

        document.getElementById('report-early').addEventListener('click', async () => {
            try {
                const response = await fetch('/report/early-exits');
                const data = await response.json();
                reportsDiv.innerHTML = `<h2>Salidas Anticipadas</h2>${data.map(exit => `<p>${exit.email}: ${new Date(exit.timestamp).toLocaleString()}</p>`).join('')}`;
            } catch (error) {
                console.error('Error:', error);
            }
        });

        document.getElementById('report-missing').addEventListener('click', async () => {
            try {
                const response = await fetch('/report/missing-records');
                const data = await response.json();
                reportsDiv.innerHTML = `<h2>Registros Faltantes</h2>${data.map(user => `<p>${user.email}</p>`).join('')}`;
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    if (createUserForm) {
        createUserForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('create-email').value;
            const password = document.getElementById('create-password').value;
            const role = document.getElementById('create-role').value;

            try {
                const response = await fetch('/users/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, role })
                });
                const result = await response.text();
                if (response.ok) {
                    alert('Usuario creado correctamente.');
                } else
                if (response.ok) {
                    alert('Usuario creado correctamente.');
                } else {
                    alert('Error al crear usuario.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    if (updateUserForm) {
    updateUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('update-id').value;
        const email = document.getElementById('update-email').value;
        const password = document.getElementById('update-password').value;
        const role = document.getElementById('update-role').value;

        try {
            const response = await fetch('/users/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, email, password, role })
            });
            const result = await response.text();
            console.log(result); // Ver respuesta del servidor
            if (response.ok) {
                alert('Usuario modificado correctamente.');
            } else {
                alert('Error al modificar usuario.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

    if (deleteUserForm) {
        deleteUserForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('delete-id').value;

            try {
                const response = await fetch('/users/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                });
                const result = await response.text();
                if (response.ok) {
                    alert('Usuario eliminado correctamente.');
                } else {
                    alert('Error al eliminar usuario.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }
});

