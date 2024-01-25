import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PortalSwitcher from './PortalSwitcher';

const RenderComponent = ({ ...props }) => render(<PortalSwitcher {...props} />);

describe('Portal Switcher', () => {
	beforeEach(() => {
		RenderComponent({});
	})
	it('renders', () => {
		const container = screen.getByTestId('portal-switcher');
		expect(container).toBeInTheDocument();
	});

	it('should navigate to the Agent landing page', async () => { 
		const agentPortalLink = screen.getByText(/insurance agent portal/i);
		expect(agentPortalLink).toHaveProperty("href", expect.stringMatching("/account/agents"));
	 })

	 it('should show the menu', async () => { 
		const agentPortalLink = screen.getByText(/insurance agent portal/i);
		await userEvent.hover(agentPortalLink);
		const brokerPortalLink = screen.getByText(/broker portal/i);
		expect(brokerPortalLink).toBeInTheDocument();
	  })

	  it('should show the menu on tab', async () => { 
		  const agentPortalLink = screen.getByText(/insurance agent portal/i);
		await userEvent.tab();
		expect(agentPortalLink).toHaveFocus();
		await userEvent.tab();
		await userEvent.keyboard(" ");
		const brokerPortalLink = screen.getByText(/broker portal/i);
		expect(brokerPortalLink).toBeInTheDocument();
	   })
	  
	   it('should hide the menu on escape', async () => { 
		await userEvent.tab();
		await userEvent.tab();
		await userEvent.keyboard(" ");
		const brokerPortalLink = screen.getByText(/broker portal/i);
		expect(brokerPortalLink).toBeInTheDocument();
		await userEvent.keyboard("{Escape}");
		expect(brokerPortalLink).not.toBeInTheDocument();
	   })
});
