<script>
  import Footer from './components/Footer.svelte';
  import Header from './components/Header.svelte';
  import Filter from './components/Filter.svelte';
  import TailwindCss from './lib/TailwindCSS.svelte';
  import Cars from './pages/Cars.svelte'
  import CarDetails from "./pages/CarDetails.svelte";
  import Login from './pages/Login.svelte';
  import Register from './pages/Register.svelte';
  import User from './pages/User.svelte';

  import { onMount } from 'svelte';
 
  import Page from 'page';

  let currentRoute;
  let currentParams;

  let cars = [];
  let filteredCars = [];
  let selectedBrand = '';
  let selectedMake = '';
  let tempMinYear = '';
  let tempMaxYear = '';

  let loggedInUser = null;

  
  Page('/', (ctx) => { 
    currentRoute = Cars; 
    currentParams = ctx.params;
  });
  
  Page('/cars/:id', (ctx) => {
    currentRoute = CarDetails;
    currentParams = ctx.params;
  });

  Page('/auth/login', (ctx) => { 
    currentRoute = Login; 
    currentParams = ctx.params; 
  });

  Page('/auth/register', (ctx) => { 
    console.log('routed to login')
    currentRoute = Register; 
    currentParams = ctx.params;
  });

  Page('/users/me/:id', (ctx) => { 
    currentRoute = User;
    currentParams = ctx.params;
  });
  
  Page('*', (ctx) => { 
    currentRoute = undefined; 
    currentParams = ctx.params;
    console.error('Route not found');
  });

  
  Page.start();



  const handleLogin = (event) => {
    const { username } = event.detail;
    loggedInUser = username;
    Page('/');
  };

  const handleRegister = (event) => {
    const { token, username } = event.detail;
    loggedInUser = username;
    Page('/');
  };

  function refreshCars() {
    fetch("http://localhost:3000/cars")
      .then(response => response.json())
      .then(data => {
        cars = data;
        filteredCars = data;
      });
  }

  function handleFilter(event) {
    selectedBrand = event.detail.selectedBrand;
    selectedMake = event.detail.selectedMake;
    tempMinYear = event.detail.minYear;
    tempMaxYear = event.detail.maxYear;

    filteredCars = cars.filter(car => {
      return (
        (selectedBrand ? car.brand === selectedBrand : true) &&
        (selectedMake ? car.model === selectedMake : true) &&
        (tempMinYear ? car.year >= parseInt(tempMinYear) : true) &&
        (tempMaxYear ? car.year <= parseInt(tempMaxYear) : true)
      );
    });
  }

  function handleClearFilters() {
    selectedBrand = '';
    selectedMake = '';
    tempMinYear = '';
    tempMaxYear = '';
    filteredCars = cars;
  }

</script>

<TailwindCss />

<Header />

<svelte:component this={currentRoute} {currentParams}/>

<Footer />
