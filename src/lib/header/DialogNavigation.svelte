<script>
    import LogOut from '@lucide/svelte/icons/log-out';
    import Settings from '@lucide/svelte/icons/settings';
    import Palette from '@lucide/svelte/icons/palette';

    /** @type {HTMLDialogElement} */
    let dialogMenu;

    export function openNav() {
        dialogMenu.showModal();
    }

    export function closeNav() {
        dialogMenu.close();
    }
</script>

<dialog bind:this={dialogMenu} class={[ 
    'rounded-2xl',
    'backdrop-blur-lg',
    'bg-white/30',
    'dark:bg-black/30',
    'border',
    'border-white/30',
    'shadow-xl',
    'transition-all',
    'duration-300',
    'focus:outline-none',
    'max-w-xs',
    'w-full',
    'm-auto',
    'p-0'
]}>
    <div class={[ 
        'flex', 'flex-col', 'p-4', 'space-y-2',
        'bg-transparent',
        'rounded-2xl',
        'backdrop-blur-none'
    ]}>
        <a href="/auth/sign-out" class={[ 
            'flex', 'items-center', 'gap-3',
            'px-4', 'py-3',
            'bg-white/30', 'dark:bg-black/30',
            'backdrop-blur',
            'text-primary', 'dark:text-white',
            'font-medium', 'rounded-xl',
            'hover:bg-white/40', 'dark:hover:bg-black/40',
            'transition-all', 'duration-300',
            'focus:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-primary',
            'hover:scale-105', 'hover:-translate-y-0.5',
            'active:scale-98',
            'select-none',
            'shadow',
        ]}>
            <LogOut size={18} />
            로그아웃
        </a>
        <a href="/my-page" class={[ 
            'flex', 'items-center', 'gap-3',
            'px-4', 'py-3',
            'bg-white/30', 'dark:bg-black/30',
            'backdrop-blur',
            'text-primary', 'dark:text-white',
            'font-medium', 'rounded-xl',
            'hover:bg-white/40', 'dark:hover:bg-black/40',
            'transition-all', 'duration-300',
            'focus:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-primary',
            'hover:scale-105', 'hover:-translate-y-0.5',
            'active:scale-98',
            'select-none',
            'shadow',
        ]}>
            <Settings size={18} />
            마이페이지
        </a>
        <a href="/theme" class={[ 
            'flex', 'items-center', 'gap-3',
            'px-4', 'py-3',
            'bg-gradient-to-r', 'from-pink-400', 'to-purple-400',
            'text-white', 'font-bold', 'rounded-xl',
            'hover:from-pink-500', 'hover:to-purple-500',
            'transition-all', 'duration-300',
            'focus:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-pink-300',
            'hover:scale-105', 'hover:-translate-y-0.5',
            'active:scale-98',
            'select-none',
            'shadow',
        ]}>
            <Palette size={18} />
            테마 선택
        </a>
    </div>
    <form method="dialog" class={[ 
        'w-full', 'flex', 'justify-center', 'p-4',
        'bg-transparent',
    ]}>
        <button
            class={[
                'w-full', 'py-3', 'rounded-xl',
                'bg-gradient-to-r', 'from-pink-200', 'to-purple-200',
                'dark:from-pink-900', 'dark:to-purple-900',
                'text-primary', 'dark:text-white',
                'font-bold',
                'transition-all', 'duration-300',
                'hover:from-pink-300', 'hover:to-purple-300',
                'dark:hover:from-pink-800', 'dark:hover:to-purple-800',
                'hover:scale-105', 'hover:-translate-y-0.5',
                'active:scale-98',
                'focus:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-pink-300',
                'select-none',
                'shadow',
            ]}
        >
            닫기
        </button>
    </form>
</dialog>
