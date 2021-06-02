<script lang="ts">
    import { onMount, tick } from "svelte";
    import { shortcuts, summoned } from "../../stores/rooster";
    import { fade } from "svelte/transition";
    import { caretToEnd } from "../../utils/utils";
    
    let command = '';
    let argument = '';
    let suggestion = '';
    let commandBox: HTMLInputElement;
    let argumentBox: HTMLElement;

    $: handleSummon($summoned);
    $: handleCommand(command);
    $: handleArgument(argument);

    function resetInputs() {
        command = '';
        argument = '';
        suggestion = '';
    }

    function handleSummon(summoned: boolean) {
        if (!summoned) resetInputs();
    }

    function handleCommand(command: string) {
        if (!command || command === '') {
            return;
        }

        for (const [key, value] of Object.entries(shortcuts.getAll())) {
            if (key.startsWith(command)) {
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
        
        const currentCommand = shortcuts.get(command.replace(/:$/, ''));
        if (currentCommand) {
            for (const [key, value] of Object.entries(currentCommand)) {
                if (key.startsWith(argument) && value.active !== false) {
                    suggestion = key.replace(argument, '');
                    return;
                }
            }
        }

        suggestion = '';
    }

    async function fill() {
        if (document.activeElement === commandBox) {
            command += suggestion;
            await tick();
            argumentBox.focus();
        }

        else if (document.activeElement === argumentBox) {
            argument += suggestion;
            await tick();
            caretToEnd(argumentBox);
        }
    }

    function handleInputKeydown(event: KeyboardEvent) {
        if (event.code === 'ArrowRight') {
            fill();
            suggestion = '';
        }
        
        else if (event.code === 'Backspace') {
            if (document.activeElement === argumentBox && argument === '') {
                event.preventDefault();
                commandBox.focus();
                caretToEnd(commandBox);
            }
        }

        else if (event.code === 'Space') {
            if (document.activeElement === commandBox) {
                event.preventDefault();
                command += ':';
                argumentBox.focus();
            }
        }

        else if(event.code === 'Enter') {
            event.preventDefault();
            const currentCommand = shortcuts.get(command.replace(/:$/, ''));
            if (currentCommand && currentCommand[argument]) {
                currentCommand[argument].callback();
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

    function handleFocus() {
        tick().then(() => {
            const toFocus = argument.length ? argumentBox : commandBox;
            toFocus.childNodes[0] ? caretToEnd(toFocus) : toFocus.focus();
        });
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $summoned}
    <div 
        id="rooster" 
        class="flex md:w-2/5 h-14 rounded-xl mb-4 bg-secondary fixed bottom-0 left-2/4 transform -translate-x-2/4 z-50 items-center" 
        in:fade={{ duration: 100 }}
        out:fade={{ duration: 100 }}
        on:click={handleFocus}
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
            class="bg-transparent text-primary text-xl font-primary underline"
        />
        {#if command.length > 2}
            <span class="text-secondary text-xl font-primary select-none">{suggestion}</span>
        {/if}
    </div>
{/if}