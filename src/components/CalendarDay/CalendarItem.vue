<script setup>
const props = defineProps({
    name: "string",
    title: "string",
    height: "string",
    y: "string"
})

</script>

<template>
  <div class="calendar-elem" :style="{height:props.height, top: props.y}">
      <h4>{{props.title}}</h4>
      <p>{{props.name}}</p>
  </div>
</template>

<style scoped>
.calendar-elem{
    width: 100%;
    background: #00ff00;
    position: absolute;
    left: 0;
}
</style>