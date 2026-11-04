<script>
    import { modal, Settings, Help, Info } from '$lib/modals'
    import { SettingsIcon, HelpIcon, InfoIcon, BugReporterIcon } from '$lib/shared/icons'

    let { isPlay = false, isAnswer = false } = $props()
</script>

<button class="utility-button" title="Settings" aria-label="Settings" onclick={() => modal.open(Settings, { isPlay, isAnswer })}>
    <SettingsIcon />
</button>
<button class="utility-button" title="Help" aria-label="Help" onclick={() => modal.open(Help, { isPlay, isAnswer })}>
    <HelpIcon />
</button>
<button class="utility-button" title="Info" aria-label="Info" onclick={() => modal.open(Info, { isPlay, isAnswer })}>
    <InfoIcon />
</button>
<button class="utility-button" title="Report Bug" aria-label="BugReporting" onclick={() => {window.open('https://forms.gle/L4X5HsRshrMzSD9k8', '_blank', 'noopener,noreferrer');}}>
    <BugReporterIcon />                    
</button>