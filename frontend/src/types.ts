export type typeUser =
    {
        accessToken: string,
        user:
        {
            "id": string,
            "name": string,
            "email": string,
            "username": string,
            "createdAt": Date,
            "updatedAt": Date
        }
    }

export type typeNotes =
    {
        attachment: string | null,
        authorId: string,
        backgroundColor: string,
        createdAt: Date,
        description: string | null,
        id: string,
        isFavorite: boolean,
        title: string,
        updatedAt: Date,
    }