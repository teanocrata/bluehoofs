import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders nav bar with blue hoofs heading', () => {
	const { getByText } = render(<App />);
	const blueHoofsText = getByText(/blue hoofs/i);
	expect(blueHoofsText).toBeInTheDocument();
});
