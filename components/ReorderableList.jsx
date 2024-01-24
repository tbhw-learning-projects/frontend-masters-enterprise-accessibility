import React, { useCallback } from 'react';
import * as ReactAriaLiveAnnouncer from '@react-aria/live-announcer';

function announce(message) {
	return ReactAriaLiveAnnouncer.announce(message, 'assertive');
}

const itemData = ['Paddle Boards', 'Bikes', 'Skis'];

const ReorderableListItem = React.forwardRef(function ReorderableListItem({ name, index, callbackFn, ...props }, ref) {
	return (
		<li
			data-position={index}
			draggable="true"
			onDragStart={props.onDragStart}
			onDragOver={props.onDragOver}
			onDrop={props.onDrop}
			onKeyDown={(e) => callbackFn(e, index)}
			className={
				props.reorderMetadata.isDragging && props.reorderMetadata.draggedTo === Number(index) ? 'dropArea' : ''
			}>
			<span className="text">{name}</span>

			<button ref={ref} aria-label={`Reorder ${name} from position ${index}`} className="edit">
				<span className="icon-sort"></span>
			</button>
		</li>
	);
});

const ReorderableList = () => {
	const listRef = React.useRef(null);
	const buttonRef = React.useRef(null);
	const [items, setItems] = React.useState(itemData);

	const [isReordering, setIsReordering] = React.useState(false);
	const [reorderMetadata, setReorderMetadata] = React.useState({});

	const toggleIsReordering = useCallback(() => {
		setIsReordering((prev) => !prev);
	}, []);
	const onDragStart = (event) => {
		const initialPosition = Number(event.currentTarget.dataset.position);

		setReorderMetadata({
			...reorderMetadata,
			draggedFrom: initialPosition,
			isDragging: true,
			originalOrder: items,
		});

		// Note: this is only for Firefox.
		event.dataTransfer.setData('text/html', '');
	};
	const onDragOver = (event) => {
		event.preventDefault();

		let newList = reorderMetadata.originalOrder;
		const draggedFrom = reorderMetadata.draggedFrom;
		const draggedTo = Number(event.currentTarget.dataset.position);
		const itemDragged = newList[draggedFrom];
		const remainingItems = newList.filter((item, index) => index !== draggedFrom);

		newList = [...remainingItems.slice(0, draggedTo), itemDragged, ...remainingItems.slice(draggedTo)];

		if (draggedTo !== reorderMetadata.draggedTo) {
			setReorderMetadata({
				...reorderMetadata,
				updatedOrder: newList,
				draggedTo: draggedTo,
			});
		}
	};
	const onDrop = () => {
		setItems(reorderMetadata.updatedOrder);
		setReorderMetadata({
			...reorderMetadata,
			draggedFrom: null,
			draggedTo: null,
			isDragging: false,
		});
	};
	const itemCallbackFn = (event, itemIndex) => {
		let nextIndex = null;
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (itemIndex < items.length - 1) {
				nextIndex = itemIndex + 1;
			}
		}
		if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (itemIndex > 0) {
				nextIndex = itemIndex - 1;
			}
		}

		if (nextIndex !== null) {
			let tmpArray = items.slice();
			tmpArray.splice(nextIndex, 0, tmpArray.splice(itemIndex, 1).pop());
			setItems(tmpArray);
			setReorderMetadata((metadata) => ({ ...metadata, draggedFrom: itemIndex, draggedTo: nextIndex }));
			announce(`${tmpArray[nextIndex]} moved to position ${nextIndex + 1}`);
		}

		
		// focus locking
		if (event.key === 'Escape') {
			buttonRef.current.click();
		}
		if (event.key === 'Tab') {
			if (itemIndex === 0 && event.shiftKey && [event.ctrlKey, event.metaKey, event.altKey].every((value) => !value)) {
				event.preventDefault();
				listRef.current.children[items.length - 1].querySelector('button.edit').focus();
			} else if (
				itemIndex === items.length - 1 &&
				[event.shiftKey, event.ctrlKey, event.metaKey, event.altKey].every((value) => !value)
			) {
				event.preventDefault();
				listRef.current.children[0].querySelector('button.edit').focus();
			}
		}
	};

	React.useEffect(() => {
		console.log('Dragged From: ', reorderMetadata && reorderMetadata.draggedFrom);
		console.log('Dropping Into: ', reorderMetadata && reorderMetadata.draggedTo);
		listRef.current.children[reorderMetadata.draggedTo].querySelector('button.edit').focus();
	}, [reorderMetadata]);

	React.useEffect(() => {
		if (isReordering) {
			listRef.current.children[0].querySelector('button.edit').focus();
		} else {
			buttonRef.current.focus();
		}
	}, [isReordering]);

	React.useEffect(() => {
		console.log('List updated!');
	}, [items]);

	return (
		<div className={`sortable-list-group ${isReordering ? 'active' : ''}`}>
			<button ref={buttonRef} id="my-edit-list" onClick={toggleIsReordering}>
				<span className="editingText">Exit edit mode</span>
				<span className="defaultText">Edit gear list</span>
			</button>
			<ul ref={listRef} aria-roledescription="Sortable list" role={isReordering ? "application" : undefined} className="sortable-list">
				{items.map((item, index) => {
					return (
						<ReorderableListItem
							callbackFn={itemCallbackFn}
							key={index}
							name={item}
							index={index}
							onDragStart={onDragStart}
							onDragOver={onDragOver}
							onDrop={onDrop}
							reorderMetadata={reorderMetadata}
						/>
					);
				})}
			</ul>
		</div>
	);
};

export default ReorderableList;
