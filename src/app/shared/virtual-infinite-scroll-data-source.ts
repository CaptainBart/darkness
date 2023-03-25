import {CollectionViewer, DataSource, ListRange} from "@angular/cdk/collections";
import { Observable, of, Subscription } from "rxjs";
import { take } from "rxjs/operators";

export interface Container<TKey, TItem> {
    key: TKey;
    item?: TItem;
    isLoaded: boolean;
}

export abstract class VirtualInfiniteScrollDataSource<TKey, TItem> implements DataSource<Container<TKey, TItem>> {
    items: Container<TKey, TItem>[] = [];
    #subscription: Subscription = Subscription.EMPTY;

    constructor(
        public readonly initialKey: Date,
        public readonly totalSize: number,
        public readonly startLoadTreshold: number,
        public readonly endLoadThreshold: number,
    ) {
        this.items = Array.from({length: this.totalSize}).map((_, i) => ({
            key: this.getKeyForIndex(i),
            isLoaded: false,
        }));

    }

    connect(collectionViewer: CollectionViewer): Observable<Container<TKey, TItem>[]> {
        this.#subscription = collectionViewer.viewChange.subscribe(range => this.loadItems(range));
        return of(this.items);
    }

    disconnect(): void {
        this.#subscription.unsubscribe();
    }

    public abstract getInitialIndex(): number;
    public abstract getKeyForIndex(index: number): TKey;
    public abstract getIndexForKey(key: TKey): number;
    public abstract fetchItem(key: TKey): Observable<TItem>;

    protected loadItems(range: ListRange) {
        const containers = this.items
            .slice(
                Math.max(0, range.start - this.startLoadTreshold),
                Math.min(this.items.length, range.end + this.endLoadThreshold)
            )
            .filter(item => !item.isLoaded);

        console.log(`loading chunk ${range.start}-${range.end} with ${containers.length} unloaded items...`);
       
        for(const container of containers) {
            this.fetchItem(container.key).pipe(
                take(1)
            ).subscribe(
                (item) => {
                    container.item = item;
                    container.isLoaded = true;
                }
            );
        }
    }
}
