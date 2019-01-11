import { from, of, interval } from 'rxjs';
import { switchMap,
    withLatestFrom,
    map,
    catchError,
    tap,
    delayWhen,
    mergeMap,
    retry,
    take
 } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { ipfsActions } from '../../actions';

const files = {
    '/': {
        type: 'd',
        children: {}
    }
};

/**
 * Convert IPFS result into our internal files/dir format.
 *
 * @param {*} file - A file object in IPFS format
 */
const convertFile = (file) => {
    if (file.content) {
        const a = file.path.match("[^/]+(.*/)([^/]+)$");
        const fragments = a[1].split('/');
        let node = files['/'].children;
        for(let i = 1; i < fragments.length - 1; i++) {
            if (!node[fragments[i]]) {
                node[fragments[i]] = {
                    type: 'd',
                    children: {},
                };
            }
            node = node[fragments[i]].children;
        }
        node[a[2]] = {
            type: 'f',
            contents: file.content.toString(),
        };
    }
}

/**
 * Simple Observable which will only finish once the router.control is actually available
 *
 * @param {*} router - The router object containing the control.js reference
 */
const controlAvailable$ = (router) => interval(100)
    .pipe(
        map(() => router.control),
        retry(),
        take(1)
    )

const importProjectFromIPFS = (action$, state$, { backend, router }) => action$.pipe(
    ofType(ipfsActions.IMPORT_PROJECT_FROM_IPFS),
    withLatestFrom(state$),
    switchMap(([action,]) => {
        const hash = action.data;
        return from(backend.ipfsFetchFiles(hash))
        .pipe(
            delayWhen(() => controlAvailable$(router)),
            mergeMap(response => from(response)
                .pipe(
                    map(file => convertFile(file)),
                    take(1)
                )
            ),
            tap(() => router.control.importProject(files, true)),
            map(ipfsActions.importProjectFromIpfsSuccess),
            catchError((error) => {
                console.log("There was an issue importing the project from IPFS: " + error);
                backend._stripIpfsHash();
                return of(ipfsActions.importProjectFromIpfsFail())
            })
        )
    })
);



export default importProjectFromIPFS;
