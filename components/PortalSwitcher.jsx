import { useCallback, useRef, useState } from 'react';
import { IconDownArrow } from './Icons';

const PortalSwitcher = ({ children, ...props }) => {
	const [{isMenuShowing, toggleButtonRef}, { toggleIsMenuShowing, handleEscapeKey: handleEscapeKey }] = useMenu();
	return (
		<div className={'portal-switcher'} {...props}>
			<div onMouseEnter={toggleIsMenuShowing} onMouseLeave={toggleIsMenuShowing}>
				<div className="logo-row">
					<img
						className="logo"
						src="https://res.cloudinary.com/dsrqk3ngz/image/upload/v1702580644/insurance-agency-meta_ujrtfn.png"
						width={75}
						alt="Company Logo"
					/>
					<div className="text-col">
						<a href="/account/agents">Insurance Agent Portal</a>

						<button
							ref={toggleButtonRef}
							className="change-portal-text focus-visible:ring-2"
							aria-expanded={isMenuShowing}
							onClick={toggleIsMenuShowing}
							onKeyDown={handleEscapeKey}
							data-testid="change-portal-trigger">
							Change Portal
							<IconDownArrow />
						</button>
					</div>
				</div>
				{isMenuShowing && (
					<div className="inner-portals" onKeyDown={handleEscapeKey}>
						<a href="/account/brokers/" className="broker-link" data-testid="broker-portal-link">
							Broker Portal
						</a>
					</div>
				)}
			</div>
		</div>
	);
};

export default PortalSwitcher;

function useMenu(toggleButtonRef) {
	const defaultRef = useRef(null);
	const ref = toggleButtonRef ?? defaultRef;
	const [isMenuShowing, setIsMenuShowing] = useState(false);
	const toggleMenuDisplay = useCallback(() => setIsMenuShowing((prev) => !prev), []);
	const escapeHandler = useCallback((event) => {
		if (event.code === "Escape") {
			setIsMenuShowing(false);
			if (ref.current) {
				ref.current.focus();
			}
		}
	}, [ref])

	return [{isMenuShowing, toggleButtonRef: ref}, { toggleIsMenuShowing: toggleMenuDisplay, handleEscapeKey: escapeHandler }];
}
