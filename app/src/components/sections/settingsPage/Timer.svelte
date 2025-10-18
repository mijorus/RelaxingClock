<script lang="ts">
    import SettingsBox from "../../elements/SettingsBox.svelte";
    import Title from "../../elements/settings/Title.svelte";
    import TitleIcon from "../../elements/settings/TitleIcon.svelte";
    import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
    import Action from "../../elements/settings/Buttons/Action.svelte";
    import { onMount, tick } from "svelte";
    import moment, { Moment } from "moment";
    import momentDurationFormatSetup from "moment-duration-format";
    import { fly } from "svelte/transition";
    import time from "../../../stores/time";
    import { alarmIsRinging, tips } from "../../../stores/globalState";
    import { notifications } from "../../../stores/notifications";
    import { shakeElement } from "../../../utils/utils";
    import { alarmTime, clockFormat, clockStyleClass, timerTime } from "../../../stores/storedSettings";
    import { canBeSummoned, shortcuts } from "../../../stores/rooster";
    import { ring, clearAlarmMemory, clearTimerMemory } from "../../../handlers/alarm";

    momentDurationFormatSetup(moment);

    let hours: string;
    let minutes: string;
    let seconds: string;
    let alarm: Moment = moment();
    let creationBox: HTMLElement;

    $: format = $clockFormat === "24h" ? "HH:mm:ss" : "h:mm:ss a";
    $: primaryBoxTitle =
        $timerTime && moment($timerTime, "X").isValid()
            ? `${localStorage.getItem("timerTitle") ? '"' + localStorage.getItem("timerTitle") + '" r' : "R"}ings at ${moment($timerTime, "X").format(format)}`
            : "Set a timer";

    let title: HTMLInputElement;
    let creationBoxOpened = false;
    const minutesPassedCheck = 15;

    $: periodicCheck($time);

    function periodicCheck(time: Moment, force = false) {
        
        if (force || (time.unix() === $timerTime)) {
            if (
                !$alarmIsRinging &&
                time.unix() >= $timerTime &&
                time.unix() - $timerTime < minutesPassedCheck * 60
            ) {
                ring();
            } else if (
                moment($timerTime, "X").isSameOrBefore(moment().subtract(minutesPassedCheck, "m"))
            ) {
                console.log("removing old timers");
                clearAlarmMemory();
            }
        }
    }

    function handleAlarmKeyDown(event: KeyboardEvent) {
        if (
            event.code.match(/enter/i) ||
            (event.key.length === 1 &&
                (!event.code.match(/\d/) ||
                    (hours.length > 1 && minutes.length > 1 && seconds.length > 1)))
        ) {
            event.preventDefault();
        }
    }

    function handleShortcuts(event: KeyboardEvent) {
        if (event.ctrlKey && event.code === "Enter") {
            saveInput();
        } else if (event.code === "Escape") {
            closeCreationBox();
        }
    }

    async function openCreationBox() {
        alarm = moment();

        hours = '00'
        minutes = '00'
        seconds = '00'

        canBeSummoned.set(false);
        creationBoxOpened = true;

        await tick();

        document.getElementById("timer-s-input").focus();
        tips.set([
            { name: "Create", shortcut: "Ctrl+Enter" },
            { name: "Dismiss", shortcut: "Esc" },
        ]);
    }

    function saveInput() {
        const duration = moment.duration({
            hours: parseInt(hours),
            minutes: parseInt(minutes),
            seconds: parseInt(seconds),
        });

        alarm = moment().add(duration);

        if (
            !alarm.isValid() ||
            alarm.isSameOrBefore(moment()) ||
            parseInt(hours) > 99 ||
            parseInt(minutes) > 59 ||
            parseInt(seconds) > 59
        ) {
            shakeElement(creationBox);
            return;
        }

        createAlarm(title.value);
        closeCreationBox();
    }

    function createAlarm(timerTitle?: string) {
        clearTimerMemory();
        timerTime.set(alarm.unix());

        if (timerTitle && timerTitle.length > 0) localStorage.setItem("timerTitle", timerTitle);
    }

    function closeCreationBox() {
        canBeSummoned.set(true);
        creationBoxOpened = false;
        tips.set(null);
        alarm = null;
    }

    function dismissAlarm() {
        clearTimerMemory();
    }

    onMount(() => {
        periodicCheck(moment(), true);
    });
</script>

{#if creationBoxOpened}
    <div
        class="w-full bottom-2 left-0 flex justify-center fixed z-30"
        bind:this={creationBox}
        on:keydown={handleShortcuts}
        transition:fly={{ y: 100, duration: 300 }}
    >
        <div class="py-4 px-10 h-auto font-primary bg-secondary text-primary rounded-2xl shadow-box">
            <h2 class="text-4xl font-bold text-center font-title w-full">Set the timer</h2>
            <div class="my-2 flex flex-col justify-center">
                <div class="text-8xl p-2 mt-4 mb-1 text-center font-bold {$clockStyleClass}">
                    <span
                        id="timer-h-input"
                        bind:innerHTML={hours}
                        contenteditable
                        class="time-input"
                        on:keydown={handleAlarmKeyDown}
                    >
                    </span><span class="opacity-70">:</span><span
                        bind:innerHTML={minutes}
                        contenteditable
                        class="time-input"
                        on:keydown={handleAlarmKeyDown}
                    >
                    </span><span class="opacity-70">:</span><span
                        id="timer-s-input"
                        bind:innerHTML={seconds}
                        contenteditable
                        class="time-input"
                        on:keydown={handleAlarmKeyDown}
                    >
                    </span>
                </div>
                <div class="inline-block m-auto">
                    <div class="my-2">
                        <input
                            type="text"
                            class="bg-white bg-opacity-20 text-primary w-72 rounded-md p-1"
                            bind:this={title}
                            placeholder="Title (optional)"
                        />
                    </div>
                </div>
            </div>
            <div class="flex w-full justify-center mt-4">
                <span class="mx-1"><Action label="Create" on:click={saveInput} /></span>
                <span class="mx-1"
                    ><Action
                        label="Cancel"
                        custom
                        customClass="border-2 border-red-400 text-red-400"
                        on:click={closeCreationBox}
                    /></span
                >
            </div>
        </div>
    </div>
{/if}

<SettingsBox id="timer">
    <Title title="Timer">
        <TitleIcon>
            <i class="lnr lnr-history bg-center settings-icon" style="color: #f400ff;"></i>
        </TitleIcon>
    </Title>
    <PrimaryBox
        label={{ text: primaryBoxTitle }}
        description={{
            text: "Set a timer that will show on the main clock",
            iconClass: "lnr lnr-question-circle",
        }}
        available={true}
    >
        <Action
            custom
            label={$timerTime ? "Dismiss" : "Set"}
            on:click={(e) => {
                $timerTime ? dismissAlarm() : openCreationBox();
            }}
            customClass={$timerTime
                ? "bg-red-700 border-red-700 text-primary"
                : "text-secondary bg-highlighted border-primary"}
        ></Action>
    </PrimaryBox>
</SettingsBox>

<style>
    .time-input {
        display: inline-block;
        transition:
            opacity 0.1s linear,
            transform 0.1s linear;
        opacity: 0.7;
    }

    .time-input:focus {
        transform: scale(1.2);
        opacity: 1;
        border: none;
        outline: none;
    }

    .time-input:focus-visible {
        border: none;
        outline: none;
    }
</style>
