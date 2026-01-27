<style>
nav {
  padding: 20px;
  background: #eee;
  margin-bottom: 20px;
}
</style>

<template>
  <header>
    <nav>
      <RouterLink to="/">Trang chủ</RouterLink> | 
      <RouterLink to="/about">Giới thiệu</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

