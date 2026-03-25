<template>
  <nav
    id="nav-bottom"
    class="fixed bottom-0 w-full z-50 bg-[#061423]/90 backdrop-blur-xl border-t border-outline-variant/10 flex justify-around items-center px-4 py-3 h-16"
  >
    <NavBottomItem icon="home" label="Home" :active="true" :filled="true" />
    <NavBottomItem icon="shield" label="Segurança" />
    <NavBottomItem icon="settings_input_component" label="Serviços" />
    <NavBottomItem icon="description" label="Orçamento" />
    <NavBottomItem icon="person" label="Cliente" />
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavBottomItem from './NavBottomItem.vue'

export default defineComponent({
  name: 'NavBottom',
  components: { NavBottomItem },
})
</script>
