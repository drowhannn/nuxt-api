<template>
    <div class="grid place-content-center bg-gray-700 bg-opacity-50 absolute top-0 left-0 w-screen h-screen z-50">
        <div class="p-10 xl:p-16 relative bg-white rounded-md max-w-[95vw] max-h-[85vh] overflow-y-auto">
            <div v-if="showCloseButton" class="absolute top-4 right-4 cursor-pointer" @click="emit('close')">
                <Icon name="gridicons:cross-circle" class="h-6 xl:h-8 xl:w-8" />
            </div>
            <slot />
        </div>
    </div>
</template>
<script setup>
const emit = defineEmits(['close'])
const props = defineProps({
    showCloseButton: {
        type: Boolean,
        default: false
    },
})
</script>