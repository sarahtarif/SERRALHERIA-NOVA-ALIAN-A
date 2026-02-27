<template>
  <Card class="hover:shadow-lg transition-shadow">
    <CardContent class="p-6">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-600">{{ label }}</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">{{ formattedValue }}</p>
          <p 
            v-if="change" 
            class="text-sm mt-1"
            :class="changeColorClass"
          >
            {{ change }}
          </p>
        </div>
        <div 
          class="w-12 h-12 rounded-lg flex items-center justify-center"
          :class="iconBgClass"
        >
          <div v-html="icon" :class="iconColorClass" class="w-6 h-6"></div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: string
  color?: 'blue' | 'green' | 'orange' | 'red'
}

const props = withDefaults(defineProps<Props>(), {
  changeType: 'neutral',
  color: 'blue'
})

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString('pt-BR')
  }
  return props.value
})

const changeColorClass = computed(() => {
  switch (props.changeType) {
    case 'positive':
      return 'text-green-600'
    case 'negative':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
})

const iconBgClass = computed(() => {
  switch (props.color) {
    case 'blue':
      return 'bg-blue-100'
    case 'green':
      return 'bg-green-100'
    case 'orange':
      return 'bg-orange-100'
    case 'red':
      return 'bg-red-100'
    default:
      return 'bg-blue-100'
  }
})

const iconColorClass = computed(() => {
  switch (props.color) {
    case 'blue':
      return 'text-blue-600'
    case 'green':
      return 'text-green-600'
    case 'orange':
      return 'text-orange-600'
    case 'red':
      return 'text-red-600'
    default:
      return 'text-blue-600'
  }
})
</script>
