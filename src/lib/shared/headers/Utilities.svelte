<script>
    import { modal, Settings, Help, Info } from '$lib/modals'
    import { SettingsIcon, HelpIcon, InfoIcon, BugReporterIcon } from '$lib/shared/icons'
</script>

<div class="button-circle-top">
    <button class="utility-button" title="Settings" aria-label="Settings" onclick={() => modal.open(Settings)}>
        <SettingsIcon />
    </button>
    <button class="utility-button" title="Help" aria-label="Help" onclick={() => modal.open(Help)}>
        <HelpIcon />
    </button>
    <button class="utility-button" title="Info" aria-label="Info" onclick={() => modal.open(Info)}>
        <InfoIcon />
    </button>
    <button class="utility-button" title="Report Bug" aria-label="BugReporting" onclick={() => {window.open('https://forms.gle/L4X5HsRshrMzSD9k8', '_blank', 'noopener,noreferrer');}}>
        <BugReporterIcon />                    
    </button>
</div>