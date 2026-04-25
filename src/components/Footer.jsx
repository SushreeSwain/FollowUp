function Footer() {
  return (
    <footer className="border-t border-border bg-background px-6 py-5">
        <div className="mx-auto max-w-7xl space-y-2 text-sm text-muted-foreground">
    
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span>FollowUp · v2.0</span>

                <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                    Offline and Online compatability
                </span>

                <span>
                    Thank you for using FollowUp · Contact us
                </span>
            </div>

            {/* Future rows go here */}
            {/* e.g. sync status, backup reminder, export hint */}
    
        </div>
    </footer>
  );
}

export default Footer;
