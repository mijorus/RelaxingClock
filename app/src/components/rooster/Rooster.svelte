<script lang="ts">
import { onMount, tick } from "svelte";
import { canBeSummoned, shortcuts, summoned } from "../../stores/rooster";
import { fade } from "svelte/transition";
import { caretToEnd, shakeElement } from "../../utils/utils";
import Examples from "./Examples.svelte";
import type { InjectRoosterActionEvent, RoosterExamples } from "../../types";
import { tips } from "../../stores/globalState";

    let rooster: HTMLElement;

    let commandHistory: {command: string, argument: string, params?: string}[] = [];
    let chc = -1;
    
    let command = '';
    let commandPill = {color: null, background: null};
    let commandBox: HTMLInputElement;
    let commandBoxHasFocus = false;

    let argument = '';
    let argumentBox: HTMLElement;
    const invalidArgumentTheshold = 2;

    let params = '';
    let paramsBox: HTMLElement;

    let suggestion = '';
    let examples: RoosterExamples;
    let exampleComponent: Examples;
    let exampleWait = false;

    $: handleSummon($summoned);
    $: handleCommand(command);
    $: handleArgument(argument);

    function injectAction(cmd: string, arg: string) {
        command = cmd + ':'; 
        argument = arg;
        params = '';
        examples = {};
        commandPill.background = shortcuts.get(clearCommand()).background ?? null;
        commandPill.color = shortcuts.get(clearCommand()).color ?? null;
        handleCommand(command);
        tick().then(() => paramsBox.focus());
    }

    function clearCommand() {
        return command.replace(/:$/, '');
    }

    function resetInputs() {
        command = ''; argument = ''; suggestion = ''; params = ''; examples = null; chc = -1; exampleWait = false;
    }

    function handleSummon(summoned: boolean) {
        if (!summoned) {
            resetInputs();
            tips.set(null);
        } else {
            tips.set([{shortcut: 'Page Up / Down', name: 'Move in history'}]);
        }
    }

    function handleCommand(command: string) {
        if (!command || command === '' || command.length < 1) {
            return;
        }

        for (const key of Object.keys(shortcuts.getAll())) {
            if (key.startsWith(command)) {
                suggestion = key.replace(command, '') + ':';
                commandPill.background = shortcuts.get(key).background ?? null;
                commandPill.color = shortcuts.get(key).color ?? null;
                return;
            }
        }

        if (!shortcuts.get(clearCommand()) || !command.endsWith(':')) {
            commandPill = { background: null, color: null };
        }

        suggestion = '';
    }

    function handleArgument(arg: string) {
        if (arg && arg.length) {
            const currentCommand = shortcuts.get(clearCommand());
            if (currentCommand && currentCommand.arguments) {
                for (const [key, value] of Object.entries(currentCommand.arguments)) {
                    if (key !== '' && key.startsWith(arg) && value.active !== false) {
                        suggestion = key.replace(arg, '');
                        return;
                    }
                }

                if (suggestion === '') {
                    const argKeys = Object.keys(currentCommand.arguments);
                    if (arg.length > ((argKeys.length === 1 && argKeys[0] === '') ? 0 : invalidArgumentTheshold) && (argKeys).includes('')) {
                        params = arg;
                        argument = '';
                        paramsBox.focus();
                        tick().then(() => caretToEnd(paramsBox));
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
        event.stopPropagation();

        if (event.altKey) {
            handleWindowKeydown(event);
            return;
        }

        if (event.code === 'ArrowRight' || event.code === 'Tab') {
            if (document.activeElement === argumentBox || document.activeElement === commandBox) {
                event.preventDefault();
                await fill();
                suggestion = '';
            }
        }

        else if (event.code === 'ArrowUp') {
            event.preventDefault();
            exampleComponent.move(true);
        }

        else if (event.code === 'ArrowDown') {
            event.preventDefault();
            exampleComponent.move(false);
        }

        else if (event.code === 'PageUp' || event.code === 'PageDown') {
            event.preventDefault();
            if (commandHistory.length) {
                if (event.code === 'PageUp') {
                    if (chc < 0) chc = commandHistory.length - 1;
                    else if (chc === 0) { shakeElement(rooster); return }
                    else chc = chc - 1;  
                } 
                
                else if (event.code === 'PageDown') {
                    if (chc < 0 || chc === commandHistory.length - 1) { shakeElement(rooster); return; }
                    else { chc = chc + 1 }
                }
                                
                // command = commandHistory[chc].command + ':'; argument = commandHistory[chc].argument;
                injectAction(commandHistory[chc].command, commandHistory[chc].argument);
            } else {
                shakeElement(rooster);
            }
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

        else if (event.code === 'Enter' || event.code === 'NumpadEnter') {
            event.preventDefault();
        }

        else if (event.code === 'Escape') {
            resetInputs();
            summoned.set(false);
        }

        // Command execution
        const currentCommand = shortcuts.get(clearCommand());
        if (currentCommand) {
            if(event.code === 'Enter' || event.code === 'NumpadEnter') {
                if (currentCommand.arguments[argument]) {
                    try {
                        let action = null;
                        if (event.ctrlKey && !event.shiftKey) action = 1;
                        else if (event.ctrlKey && event.shiftKey) action = 2;
                        
                        if (await currentCommand.arguments[argument].callback(params, exampleComponent.trigger(), action)) {
                            // commandHistory.push({command: clearCommand(), argument, params}); @todo
                            const lastCommand = commandHistory.length > 0 ? commandHistory[commandHistory.length - 1] : undefined;
                            if (!lastCommand || (command !== lastCommand.command && argument !== lastCommand.argument)) {
                                commandHistory.push({command: clearCommand(), argument, params});
                            }

                            resetInputs();
                            summoned.set(false);
                        } else {
                            throw Error('something went wrong in ' + command + ' triyng to execute ' + argument +'; however it could be just a wrong user input');
                        }
                    } catch (e) {
                        console.warn(e);
                        shakeElement(rooster);
                    }
                }
            } else {
                if (event.key.length === 1 && event.key.length === 1 && currentCommand.examples) { //@todo commands are sent with one key - delay
                    exampleWait = true;
                    currentCommand.examples(argument, `${params}${event.key.length === 1 ? event.key : ''}`).then((res) => {examples = res; exampleWait = false;})
                }
            }
        };
    }

    function handleWindowKeydown(event: KeyboardEvent) {
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

        if (event.altKey && (event.key.length === 1)) {
            for (const [c, cmd] of Object.entries(shortcuts.getAll())) {
                for (const [a, arg] of Object.entries(cmd.arguments)) {
                    if (arg.quickLaunch === event.key) {
                        event.preventDefault();
                        summoned.set(true);
                        injectAction(c, a);
                        return;
                    }
                }
            }
        }

        return;
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

    onMount(() => {
        window.addEventListener('injectRoosterAction', (e: InjectRoosterActionEvent) => {
            injectAction(e.detail.command, e.detail.argument);
        })
    })
</script>

<svelte:window on:keydown={handleWindowKeydown} />

{#if $summoned && $canBeSummoned}
    <div class="fixed bottom-0 w-full flex flex-col items-center justify-center z-50">
        <Examples bind:this={exampleComponent} command={command} examples={examples} wait={exampleWait}/>
        <div
            id="rooster"
            bind:this={rooster}
            class="flex w-11/12 sm:w-4/5 lg:w-2/5 h-14 rounded-xl mb-4 bg-secondary items-center shadow-box"
            in:fade={{ duration: 100 }}
            out:fade={{ duration: 100 }}
            on:click={handleFocus}
        >
            <i class="lnr lnr-chevron-right text-primary justify-self-start	inline-block px-3 text-xl"></i>
            <span
                id="rooster-command"
                on:keydown={handleInputKeydown}
                bind:this={commandBox}
                bind:textContent={command}
                on:focus={() => commandBoxHasFocus = true}
                on:blur={() => commandBoxHasFocus = false}
                contenteditable
                style="color: {commandPill.color}; background-color: {commandPill.background}"
                class="bg-highlighted text-dark text-xl font-primary rounded-lg {commandBoxHasFocus ? 'p-0.5 mr-2' : ''} 
                    md:p-0.5 md:mr-2 opacity-80 focus:opacity-100  contenteditable command"
            />
            <span
                on:focus={() => commandBox.focus()}
                style="color: {commandPill.color}; background-color: {commandPill.background}"
                class="{commandBoxHasFocus ? 'hidden' : 'inline'} md:hidden bg-highlighted text-dark text-xl font-primary rounded-lg p-0.5 opacity-80 focus:opacity-100 mr-2 command-sm"
            >{command.length ? command[0] : ''}:</span>   
            <span
                on:keydown={handleInputKeydown}
                bind:textContent={argument}
                bind:this={argumentBox}
                contenteditable
                id="rooster-argument"
                class="bg-transparent text-primary text-xl font-primary underline mr-2 contenteditable"
            />
            <span
                on:keydown={handleInputKeydown}
                bind:textContent={params}
                bind:this={paramsBox}
                contenteditable
                id="rooster-params"
                class="bg-transparent text-primary text-opacity-75 text-xl font-primary contenteditable"
                style="overflow-x: hidden"
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

    .contenteditable {
        white-space: nowrap;
    }

    @media only screen and (max-width: 768px) {
        .contenteditable.command {
            max-width: 0;
            opacity: 0;
        }

        .contenteditable.command:focus-visible{
            max-width: unset;
            opacity: unset;
        }
    }
</style>