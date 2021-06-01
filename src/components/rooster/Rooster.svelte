<script lang="ts">
    import { onMount, tick } from "svelte";
    import { summoned } from "../../stores/rooster";
    import { fade } from "svelte/transition";
    import { caretToEnd } from "../../utils/utils";
    
    let command = '';
    let argument = '';
    let suggestion = '';
    let commandBox: HTMLInputElement;
    let argumentBox: HTMLElement;

    const shortcuts = {
        spotify: {
            actions: ['playlist', 'podcast'],
        },
        alarm: {
            actions: ['set', 'dismiss'],
        }
    };

    $: handleCommand(command);
    $: handleArgument(argument);

    let match = { command: null, action: null, current: null };

    function handleCommand(command: string) {
        if (!command || command === '') {
            return;
        }

        for (const [key, value] of Object.entries(shortcuts)) {
            if (key.startsWith(command)) {
                Object.assign(match, {command: key, current: 'command'});
                suggestion = key.replace(command, '') + ':';
                return;
            }
        }

        suggestion = '';
    }

    function handleArgument(argument: string) {
        if (!argument || argument === '') {
            suggestion = '';
            return;
        }
        
        if (match.command) {
            for (const action of shortcuts[match.command].actions) {
                if (action.startsWith(argument)) {
                    Object.assign(match, {action, current: 'action'});
                    suggestion = action.replace(argument, '');
                    return;
                }
            }
        }

        suggestion = '';
    }

    async function fill() {
        if (match.current === 'command') {
            command += suggestion;
            await tick();
            argumentBox.focus();
        } 
        
        else if (match.current === 'action') {
            argument += suggestion;
            await tick();
            caretToEnd(argumentBox);
        }

        suggestion = '';
    }

    function handleInputKeydown(event: KeyboardEvent) {
        if (event.code === 'ArrowRight') {
            fill();
        }
        
        else if (event.code === 'Backspace') {
            if (document.activeElement === argumentBox && argument === '') {
                event.preventDefault();
                commandBox.focus();
                caretToEnd(commandBox);
            }
        }

        else if (event.code === 'Space') {
            if (document.activeElement === commandBox && command.endsWith(':')) {
                event.preventDefault();
                argumentBox.focus();
            }
        }
    }

    async function handleKeydown(event: KeyboardEvent) {
		if (event.code === 'Space' && event.ctrlKey) {
			summoned.set(!$summoned);
            await tick();
            commandBox.focus();
		}
        
        if (event.code === 'Escape') {
            if($summoned) summoned.set(false);
        }
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $summoned}
    <div 
        id="rooster" 
        class="flex md:w-2/5 h-14 rounded-xl mb-4 bg-secondary fixed bottom-0 left-2/4 transform -translate-x-2/4 z-50 items-center" 
        in:fade={{ duration: 100 }}
        out:fade={{ duration: 100 }}
        on:click={() => {if (argument.length > 0) argumentBox.focus()}}
    >
        <i class="lnr lnr-chevron-right text-primary justify-self-start	inline-block px-3 text-xl"></i>
        <span
            on:keydown={handleInputKeydown}
            bind:this={commandBox}
            bind:textContent={command}
            contenteditable
            class="bg-highlighted text-secondary text-xl font-primary rounded-lg p-0.5 mr-2 opacity-80 focus:opacity-100"
        />
        <span
            on:keydown={handleInputKeydown}
            bind:textContent={argument}
            bind:this={argumentBox}
            contenteditable
            class="bg-transparent text-primary text-xl font-primary"
        />
        {#if command.length > 2}
            <span class="text-secondary text-xl font-primary select-none">{suggestion}</span>
        {/if}
    </div>
{/if}