<script>
    import { createEventDispatcher } from 'svelte';

    let username = '';
    let password = '';
    let confirmPassword = '';
    let errorMessage = '';
    let dispatch = createEventDispatcher();

    const handleSubmit = async (event) => {
        event.preventDefault();
        errorMessage = '';

        if (password !== confirmPassword) {
            errorMessage = 'Passwords do not match';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            dispatch('register', { token: data.token, username });
        } catch (error) {
            errorMessage = error.message;
        }
    };
</script>

<div class="flex justify-center items-center min-h-screen bg-gray-100">
    <form on:submit={handleSubmit} class="bg-white p-6 rounded shadow-md w-80">
        <h2 class="text-2xl mb-4">Register</h2>
        {#if errorMessage}
            <p class="text-red-500">{errorMessage}</p>
        {/if}
        <input 
            type="text" 
            placeholder="Username" 
            bind:value={username} 
            class="block w-full p-2 border border-gray-300 rounded mb-4"
            required
        />
        <input 
            type="password" 
            placeholder="Password" 
            bind:value={password} 
            class="block w-full p-2 border border-gray-300 rounded mb-4"
            required
        />
        <input 
            type="password" 
            placeholder="Confirm Password" 
            bind:value={confirmPassword} 
            class="block w-full p-2 border border-gray-300 rounded mb-4"
            required
        />
        <button 
            type="submit" 
            class="bg-blue-600 text-white px-4 py-2 rounded">
            Register
        </button>
    </form>
</div>