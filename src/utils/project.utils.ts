export const projectUtils = {
    convertFiles: (files: any, path: string) => {
        return new Promise((resolve, reject) => {
            if (!files) {
                reject("Can't pass an empty list of files");
            }

            const parts = path.split('/');
            let folder = files['/'];
            for (let index = 0; index < parts.length - 1; index++) {
                const folder2 = folder.children[parts[index]];
                if (!folder2) {
                    // TODO - What is this magic number?
                    reject(2);
                    return;
                }
                folder = folder2;
            }
            const fileArray = [];
            const dirArray = [];
            const keys = Object.keys(folder.children);

            // tslint:disable-next-line: prefer-for-of
            for (let index = 0; index < keys.length; index++) {
                const key = keys[index];
                const file = folder.children[key];
                if (file.type === 'f') { fileArray.push({ name: key, type: file.type }); }
                if (file.type === 'd') { dirArray.push({ name: key, type: file.type }); }
            }

            resolve(dirArray.concat(files));
        });
    },

    loadFileContent: (projectFiles: any, path: string, cb: any) => {
        if (path[0] !== '/') {
            // reject('Make sure the path is absolute');
            cb({ status: 3 });
            return;
        }

        const parts = path.split('/');
        let folder = projectFiles['/'];
        for (let index = 1; index < parts.length - 1; index++) {
            let folder2 = folder.children[parts[index]];
            if (!folder2) {
                folder2 = { type: 'd', name: parts[index], children: {} };
                folder[parts[index]] = folder2;
            }
            folder = folder2;
        }
        const file = folder.children[parts[parts.length - 1]];
        console.log(file.contents);
        if (file) {
            cb({ status: 0, contents: file.contents });
        } else {
            // reject('File in path ' + path + ' not found');
            cb({ status: 3 });
        }
    }
};