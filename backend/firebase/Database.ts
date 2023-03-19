import { Database } from './Config';

type Choices = string[];
type Data = UserObject | StudySetObject;

interface UserObject {
    email: string;
    sets: string[]; // IDs of the sets the user has created
    id: string;
    name: string;
};

interface Question {
    name: string; 
    choices: Choices;
    answers: Choices;
};

interface StudySetObject {
    name: string;
    description: string;
    questions: Question[];
    owner: string; // name of the user who created the set
    id: string;
};

/** A wrappper around the FireBase Database. */
class DatabaseWrapper {
    private collections = ["users", "sets"];
    private users: Map<string, FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>> = new Map();
    private sets: Map<string, FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>> = new Map();
    
    constructor() {
        this.retreiveAll();
        setInterval(() => this.retreiveAll(), 1000 * 60 * 5);
    }

    private async retreiveAll() {
        for (const collection of this.collections) {
            Database.collection(collection).get().then((snapshot) => {
                snapshot.forEach(doc => {
                    /** @ts-ignore */
                    this[collection].set(doc.id, doc.data());
                });
            });
        };
    }

    public getEntry(type: string, filter: (entry: any) => any, num = 1, id?: string): Data | Data[] {
        /** @ts-ignore */
        if (!this[type]) throw new Error("Could not get entry: No type provided.");
        // please never do [...Map].find
        /** @ts-ignore */
        if (id) return this[type].get(id);
        else {
            /** @ts-ignore */
            const entry = [...this[type].values()].filter(filter).slice(0, num);
            if (num === 1) return entry[0];
            else return entry;
        }
    }

    public async createEntry(type: string, id: string, data: Data): Promise<Data> {
        if (!this.collections.includes(type)) throw new Error("Could not create entry: Invalid type provided.");
        await Database.collection(type).doc(id).set(data);
        /** @ts-ignore */
        this[type].set(id, data);

        return data;
    }

    public async updateEntry(type: string, id: string, data: Data): Promise<Data> {
        if (!this.collections.includes(type)) throw new Error("Could not update entry: Invalid type provided.");
        /** @ts-ignore */
        await Database.collection(type).doc(id).update(data);
        /** @ts-ignore */
        this[type].set(id, data);

        return data;
    }
};

export default new DatabaseWrapper();