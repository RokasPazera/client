<script>
    import { userStore } from "../stores/userStores";
    import { tokenStore } from "../stores/authStore";
    import { onDestroy } from "svelte";
    import { get } from 'svelte/store';

    let user = {
        id: null,
        username: '',
        email: '',
        isAdmin: false,
    };

    let token = get(tokenStore);
    let loading = true;
    let errorMessage = '';

    const unsubscribeToken = tokenStore.subscribe(value => {
        token = value;
    });

    
    


    const fetchUserData = async () => {

        if(!token){
            loading = false;
            errorMessage = "No token available.";
            return;
        }

        if (!user.id) {
            loading = false;
            return;
        }

            try {
                const response = await fetch(`http://localhost:3000/auth/profile/${user.id}`, {
                method: 'GET',    
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

                

                if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Network response was not ok');
            }

            const data = await response.json();
            user.username = data.username;
            user.email = data.email;
            if (data.status === 'success' && data.user) {
                user = data.user;
            } else {
                errorMessage = 'No user data found.';
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            errorMessage = error.message;
        } finally {
            loading = false;
        }
    }

    const unsubscribe = userStore.subscribe(value => {
      user = { ...value};
      if (user.id) {
            fetchUserData();
        }
    });

    onDestroy(() => {
    unsubscribe();
    unsubscribeToken();
});
</script>

<div class="bg-gray-800 p-6 rounded-lg shadow-md text-white">
    <h2 class="text-2xl font-bold mb-4">User Information</h2>
    {#if loading}
        <p>Loading user data...</p>
    {:else if errorMessage}
        <p class="text-red-500">{errorMessage}</p>
    {:else if user.username}
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
    {:else}
        <p>No user data found.</p>
    {/if}
</div>