document.getElementById('add-btn').addEventListener('click', async () => {
    const message = prompt("What's your whisper?");

    if (message) {
        await fetch('/api/v1/whisper', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });
        window.location.reload();
    }
});

document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        const oldMessage = e.target.getAttribute('data-message');

        const newMessage = prompt("Edit the Whisper", oldMessage);

        if (newMessage && newMessage !== oldMessage) {
            await fetch(`/api/v1/whisper/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newMessage })
            });
            window.location.reload();
        }
    });
});

document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');

        const confirmDelete = confirm("Are you sure you want to delete this whisper?");

        if (confirmDelete) {
            await fetch(`/api/v1/whisper/${id}`, {
                method: 'DELETE'
            });
            window.location.reload();
        }
    });
});