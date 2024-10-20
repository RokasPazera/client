<script>
    import { createEventDispatcher } from 'svelte';

    let dispatch = createEventDispatcher();

    let name = '';
    let password = '';
    let email = '';
    let passwordRepeat = '';
    let errorMessage = '';

    const handleSubmit = () => {
        if (password !== passwordRepeat) {
            errorMessage = 'Passwords do not match';
            return;
        }

        const users = {
            name,
            password,
            email,
            isAdmin: false,
            id: Math.floor(Math.random() * 1000000)
        };

        dispatch('addUser', users);
        resetForm();
        errorMessage = '';
    };

    const resetForm = () => {
        name = '';
        password = '';
        email = '';
        passwordRepeat = '';
    };
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <input 
        type="text" 
        placeholder="Name" 
        bind:value={name} 
        class="block w-full p-2 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <input 
        type="email" 
        placeholder="Email" 
        bind:value={email} 
        class="block w-full p-2 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <input 
        type="password" 
        placeholder="Password" 
        bind:value={password} 
        on:input={() => errorMessage = ''} 
        class="block w-full p-2 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <input 
        type="password" 
        placeholder="Password repeat" 
        bind:value={passwordRepeat} 
        on:input={() => errorMessage = ''} 
        class="block w-full p-2 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    
    {#if errorMessage}
        <p class="text-red-500">{errorMessage}</p>
    {/if}

    <button 
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300 w-full">
        Register
    </button>
</form>
