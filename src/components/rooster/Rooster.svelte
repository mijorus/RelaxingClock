<script lang="ts">
    import { onMount, tick } from "svelte";
    import { canBeSummoned, shortcuts, summoned } from "../../stores/rooster";
    import { fade } from "svelte/transition";
    import { caretToEnd, shakeElement } from "../../utils/utils";
    import Examples from "./Examples.svelte";
    import type { RoosterExample, RoosterExamples } from "../../types";

    let rooster: HTMLElement;
    
    let command = '';
    let commandPill = {color: null, background: null};
    let commandBox: HTMLInputElement;

    let argument = '';
    let argumentBox: HTMLElement;

    let params = '';
    let paramsBox: HTMLElement;

    let suggestion = '';
    let examples: RoosterExamples;
    let selectedExample = 1;

    $: handleSummon($summoned);
    $: handleCommand(command);
    $: handleArgument(argument);

    function clearCommand(c: string) {
        return c.replace(/:$/, '');
    }

    function resetInputs() {
        command = ''; argument = ''; suggestion = ''; params = '';
    }

    function handleSummon(summoned: boolean) {
        if (!summoned) resetInputs();
    }

    function handleCommand(command: string) {
        if (!command || command === '' || command.length < 1) {
            return;
        }

        for (const [key, value] of Object.entries(shortcuts.getAll())) {
            if (key.startsWith(command)) {
                suggestion = key.replace(command, '') + ':';
                commandPill.background = shortcuts.get(key).background ?? null;
                commandPill.color = shortcuts.get(key).color ?? null
                return;
            }
        }

        if (!shortcuts.get(clearCommand(command)) || !command.endsWith(':')) {
            commandPill = { background: null, color: null };
        }

        suggestion = '';
    }

    function handleArgument(argument: string) {
        if (argument && argument.length) {
            const currentCommand = shortcuts.get(clearCommand(command));
            if (currentCommand && currentCommand.arguments) {
                for (const [key, value] of Object.entries(currentCommand.arguments)) {
                    if (key.startsWith(argument) && value.active !== false) {
                        suggestion = key.replace(argument, '');
                        return;
                    }
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
            paramsBox.focus();
        }
    }

    async function handleInputKeydown(event: KeyboardEvent) {
        if (event.code === 'ArrowRight' || event.code === 'Tab') {
            if (document.activeElement === argumentBox || document.activeElement === commandBox) {
                event.preventDefault();
                fill();
                suggestion = '';
            }
        }

        if (event.code === 'ArrowUp') {
            event.preventDefault();
            selectedExample = 1;
        }

        if (event.code === 'ArrowDown') {
            event.preventDefault();
            selectedExample = -1;
        }

        else if (event.code === 'Backspace') {
            if (document.activeElement === argumentBox && argument === '') {
                event.preventDefault();
                commandBox.focus();
                caretToEnd(commandBox);
            }

            if (document.activeElement === paramsBox && params === '') {
                event.preventDefault();
                argumentBox.focus();
                caretToEnd(argumentBox);
            }
        }

        else if (event.code === 'Space') {
            if (document.activeElement === commandBox) {
                event.preventDefault();
                if (command !== '') {
                    if (!command.endsWith(':')) command += ':';
                    argumentBox.focus();
                }
            }

            if (document.activeElement === argumentBox) {
                event.preventDefault();
                if (argument !== '') {
                    paramsBox.focus();
                    suggestion = ''
                }
            }
        }

        const currentCommand = shortcuts.get(clearCommand(command));
        if (!currentCommand) return;

        if(event.code === 'Enter' || event.code === 'NumpadEnter') {
            event.preventDefault();
            if (currentCommand.arguments[argument]) {
                if (await currentCommand.arguments[argument].callback(params)) {
                    resetInputs();
                    summoned.set(false);
                } else {
                    shakeElement(rooster);
                }
            }
        } else {
            if (currentCommand.examples) {
                examples = await currentCommand.examples(argument, params);
            }
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (!$canBeSummoned) {
            return;
        }

		if (event.code === 'Space' && event.ctrlKey) {
			summoned.set(!$summoned);
            tick().then(() => commandBox.focus())
		}
        
        else if (event.code === 'Escape' && $summoned) {
            resetInputs();
            summoned.set(false);
        }
	}

    function handleFocus() {
        tick().then(() => {
            let toFocus: HTMLElement;
            if (params.length) toFocus = paramsBox;
            else if (argument.length) toFocus = argumentBox;
            else toFocus = commandBox;
            toFocus.childNodes[0] ? caretToEnd(toFocus) : toFocus.focus();
        });
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $summoned && $canBeSummoned}
    <div class="fixed bottom-0 w-full flex flex-col items-center justify-center z-50">
        <Examples command={command} examples={examples} move={selectedExample}/>
        <div
            bind:this={rooster}
            class="flex md:w-2/5 h-14 rounded-xl mb-4 bg-secondary items-center shadow-box"
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
                style="color: {commandPill.color}; background-color: {commandPill.background}"
                class="bg-highlighted text-dark text-xl font-primary rounded-lg p-0.5 opacity-80 focus:opacity-100 mr-2 contenteditable"
            />
            <span
                on:keydown={handleInputKeydown}
                bind:textContent={argument}
                bind:this={argumentBox}
                contenteditable
                class="bg-transparent text-primary text-xl font-primary underline mr-2 contenteditable"
            />
            <span
                on:keydown={handleInputKeydown}
                bind:textContent={params}
                bind:this={paramsBox}
                contenteditable
                class="bg-transparent text-primary text-xl font-primary contenteditable"
            />
            {#if command.length > 1}
                <span class="text-secondary text-xl font-primary select-none {command.endsWith(':') ? '-ml-1': '-ml-4'}">{suggestion}</span>
            {/if}
        </div>
    </div>
{/if}

<style>
    .contenteditable:focus-visible {
        border: none;
        outline: none;
    }
</style>