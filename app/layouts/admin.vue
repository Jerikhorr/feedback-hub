<template>
  <div class="flex min-h-screen bg-[#0F172A] text-slate-100 font-sans overflow-hidden">
    <aside class="w-64 border-r border-slate-800 bg-[#0B1120] flex flex-col shrink-0 z-20 shadow-xl">
      <div
        class="p-6 font-bold text-xl tracking-wider text-purple-400 border-b border-slate-800 flex items-center gap-3"
      >
        <UIcon
          name="i-heroicons-cube-transparent"
          class="w-8 h-8"
        />
        <div>
          Company
          <br />
          <span class="text-white text-sm">Test</span>
        </div>
      </div>

      <nav class="p-4 space-y-2 flex-1">
        <p class="text-xs font-semibold text-slate-500 mb-4 px-2 tracking-wider">INTERNAL MANAGEMENT</p>

        <NuxtLink
          to="/admin/dashboard"
          class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300"
          active-class="bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium"
        >
          <UIcon
            name="i-heroicons-document-text"
            class="w-5 h-5"
          />
          Form Builder
        </NuxtLink>

        <NuxtLink
          to="/admin/profile"
          class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300"
          active-class="bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium"
        >
          <UIcon
            name="i-heroicons-user"
            class="w-5 h-5"
          />
          Profile Admin
        </NuxtLink>
      </nav>
    </aside>

    <main class="flex-1 max-h-screen overflow-y-auto relative">
      <slot />
    </main>
  </div>
</template>
