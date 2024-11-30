interface NoteSummary {
    id: string;
    title: string;
    createdAt: Date;
}

export interface NoteTree {
    id: string;
    name: string;
    iconName: string;
    notes: NoteSummary[];
}
