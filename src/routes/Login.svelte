<script>
    import { createEventDispatcher } from 'svelte';
    import Page from 'page';
    import { userStore, tokenStore } from './stores.js';

    let username = '';
    let email = '';
    let password = '';
    let repeatPassword = '';
    let errorMessage = '';
    let dispatch = createEventDispatcher();
    let login = true;
    let register = false;


    const handleSubmit = async (event) => {
        event.preventDefault();
        errorMessage = '';

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.msg);
            }

            userStore.set(data.user);
            tokenStore.set(data.token);


            dispatch('login', { user: data.user });
            Page('/');
        } catch (error) {
            errorMessage = error.message || JSON.stringify(error);
        }
    };

    const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    errorMessage = '';

    if (password !== repeatPassword) {
        errorMessage = 'Passwords do not match';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || 'Registration failed');
        }

        dispatch('register', { user: data.user });
        Page('/');
    } catch (error) {
        errorMessage = error.message;
    }
};

    const toggleLogin = () => {
        register = false;
        login = true;
    };

    const toggleRegister = () => {
        register = true;
        login = false;
    };
</script>

<main class=" bg-[#222024]">
    {#if login}
        <div class="flex justify-center items-center">
            <div class="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center relative z-10">
                <button on:click={toggleRegister} class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Register</button>
                <h2 class="text-2xl font-bold mb-4">Login</h2>
                <form class="space-y-4" on:submit={handleSubmit}>
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
                        class="block w-full p-2 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                    
                    <button 
                        type="submit"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300 w-full">
                        Log In
                    </button>
                </form>
                {#if errorMessage}
                    <p class="text-red-500 mt-2">{errorMessage}</p>
                {/if}
            </div>
        </div>
    {/if}

    {#if register}
        <div class="flex justify-center items-center">
            <div class="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center relative z-10">
                <button on:click={toggleLogin} class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Login</button>
                <h2 class="text-2xl font-bold mb-4">Register</h2>
                
                <form class="space-y-4" on:submit={handleRegisterSubmit}>
                    <input 
                        type="text" 
                        placeholder="username" 
                        bind:value={username}
                        class="block w-full p-2 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                    <input 
                        type="email" 
                        placeholder="email" 
                        bind:value={email}
                        class="block w-full p-2 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                    <input 
                        type="password" 
                        placeholder="password" 
                        bind:value={password}
                        class="block w-full p-2 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                    <input 
                        type="password" 
                        placeholder="Repeat password" 
                        bind:value={password}
                        class="block w-full p-2 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                    
                    <button 
                        type="submit"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300 w-full">
                        Register
                    </button>
                </form>
                {#if errorMessage}
                    <p class="text-red-500 mt-2">{errorMessage}</p>
                {/if}
            </div>
        </div>
    {/if}
</main>
