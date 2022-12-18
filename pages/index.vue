<template>
  <div class="w-full h-screen grid place-content-center text-blue-500">
    <div class="px-6 py-2 border rounded-md flex flex-col gap-2 w-96">
      <h1 class="text-3xl uppercase font-extrabold text-center">Login</h1>
      <div class="flex flex-col gap-2">
        <label for="email" class="font-bold text-base">Email:</label>
        <input type="email" placeholder="Enter your email" class="input-primary" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="password" class="font-bold text-base">Password:</label>
        <input type="password" placeholder="Enter your password" class="input-primary" />
      </div>
      <button class="btn-primary">Login</button>
      <p class="text-sm text-blue-700 underline text-right">Forgot your Password?</p>
      <NuxtLink to="/register"><p class="text-sm text-blue-700 underline text-right">Sign Up</p></NuxtLink>
    </div>
  </div>
</template>
