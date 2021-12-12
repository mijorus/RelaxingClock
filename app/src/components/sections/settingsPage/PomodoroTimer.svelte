<script lang="ts">
import SettingsBox from '../../elements/SettingsBox.svelte';
import Title from "../../elements/settings/Title.svelte";
import TitleIcon from "../../elements/settings/TitleIcon.svelte";
import PrimaryBox from "../../elements/settings/PrimaryBox.svelte";
import Pin from '../../icons/Pin.svelte';
import Action from '../../elements/settings/Buttons/Action.svelte';
import { pinnedDBisReady } from '../../../stores/globalState';
import NestedBox from '../../elements/settings/NestedBox.svelte';
import Booleans from '../../elements/settings/Buttons/Booleans.svelte';
import { longPomodoro } from '../../../stores/storedSettings';
import Hint from '../../elements/settings/Hint.svelte';
import moment, { Moment } from 'moment';
import { notifications } from '../../../stores/notifications';
import { locSto } from '../../../utils/utils';
import { onMount } from 'svelte';
import { shortcuts } from '../../../stores/rooster';
import time from '../../../stores/time';

    const defaultTitle = 'Start the timer';
    let label = defaultTitle;
    let pomodoroIsRunning: 'focus' | 'relax' | false = false;
    let cycleEndsIn: number;
    let cycleEndsAt: Moment;
    let pomodoroTimer: NodeJS.Timeout;
    let timeLeft = '';

    $: {
        if (pomodoroIsRunning && $time) timeLeft = `[${cycleEndsAt.fromNow(true) === 'an hour' ? '45 minutes' : cycleEndsAt.fromNow(true)}]`;
        else if (!pomodoroIsRunning) timeLeft = '';
    }

    function startRelaxSession() {
        pomodoroIsRunning = 'relax';
        label = 'It\'s time for a break 😊';
        locSto('pomodoroState', pomodoroIsRunning);
        cycleEndsIn = ($longPomodoro ? 15 : 5) * 60000;
        cycleEndsAt = moment().add(cycleEndsIn, 'milliseconds');
        pomodoroTimer = setTimeout(() => startFocusSession(), cycleEndsIn);
        notifications.create({
            'title': label,
            'icon': 'icon-tomato-bw',
            'limitDisplay': 'notificationOnly',
            'content': 'Take a break',
            'sound': true,
        });
    }

    function startFocusSession() {
        label = 'Focus on your work! 🤓';
        pomodoroIsRunning = 'focus';
        locSto('pomodoroState', pomodoroIsRunning);
        const length = $longPomodoro ? 45 : 25;
        cycleEndsIn = length * 60000;
        cycleEndsAt = moment().add(cycleEndsIn, 'milliseconds');
        pomodoroTimer = setTimeout(() => startRelaxSession(), cycleEndsIn);
        notifications.create({
            'title': label,
            'icon': 'icon-tomato-bw',
            'limitDisplay': 'notificationOnly',
            'content': 'Stay concentrated for ' + length + ' minutes',
            'sound': true,
        });
    }

    function toggleTimer() {
        clearTimeout(pomodoroTimer);
        pomodoroIsRunning = pomodoroIsRunning ? false : 'focus';
        locSto('pomodoroState', pomodoroIsRunning ? pomodoroIsRunning : null);
        
        if (pomodoroIsRunning) startFocusSession();
        else label = defaultTitle;
    }

    onMount(() => {
        locSto('pomodoroState', null);
        shortcuts.set('pomodoro', {
            'color': 'black',
            'background': 'red',
            'arguments': {
                'start': {
                    description: "Start the pomodoro timer",
                    async callback(p) {
                        if (!pomodoroIsRunning) {
                            p = p.replace(/\s/g, '');
                            if (p === '+') longPomodoro.set(true);
                            else if (p === '-') longPomodoro.set(false);
                            toggleTimer();
                        }
                        else return false;
                        return true;
                    }
                },
                'stop': {
                    description: 'Stop the pomodoro timer, if it\'s running',
                    async callback() {
                        if (pomodoroIsRunning) toggleTimer();
                        else return false;
                        return true;
                    }
                }
            },
            async examples(a, p) {
                return {
                    'namespace': 'Examples',
                    'group': [
                        {'argument': 'start', 'example': '', tip: 'start the pomodoro timer with the default settings'}, 
                        {'argument': 'start', 'example': '[ + or - ]', tip: 'passing "+" stars a long session, "-" a short session'}, 
                        {'example': '', 'argument': 'stop', tip: 'stop the timer, if it\'s running'}
                    ]
                }
            }
        })
    })
</script>

<SettingsBox id="pomodoro">
    <Title title="Pomodoro timer">
        <TitleIcon>
            <i id="pomodoro-icon" class="settings-icon"><span class="icon-tomato-22"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></span></i>
        </TitleIcon>
    </Title>
    <div>
        <PrimaryBox 
            label={{text: label, bgClass: pomodoroIsRunning === 'focus' ? 'bg-red-900' : (pomodoroIsRunning === 'relax' ? 'bg-green-900' : null)}} 
            description={{text:''}}
            available={true}
        >
            <Action custom customClass="bg-transparent text-primary text-sm" label={timeLeft} />
            <Action label="{pomodoroIsRunning ? 'Stop' : 'Start'}" on:click={toggleTimer} />
        </PrimaryBox>
    </div>
    <NestedBox bordered label="Longer sessions" available={pomodoroIsRunning === false}>
        <Booleans state={$longPomodoro} label={'longer pomodoro sessions'} on:change={(e) => longPomodoro.set(e.detail)}/>
    </NestedBox>
    <Hint text={'The Pomodoro Timer efficiently splits your workflow into a 25-minutes working session and a 5-minutes break. You can also set a longer 45/15-minutes session if you really are an hard-worker'} iconClass={'lnr lnr-question-circle'}/>
</SettingsBox>