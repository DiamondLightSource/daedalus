import { ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DLSAppBar, { StyledAppBar } from '../../components/AppBar';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import BeamlineTreeStateContext from '../../routes/MainPage';
import { PageRouteInfo } from '../../routes/PageRouteInfo';
import { BeamlineTreeState } from '../../store';
import { createTheme, ThemeProvider } from '@mui/material';
import { DRAWER_WIDTH } from '../../utils/helper';

const mockContextValue = {
  state: {
    menuBarOpen: false
  } as Partial<BeamlineTreeState> as BeamlineTreeState,
  dispatch: vi.fn()
};

console.log = vi.fn();

const mockHistoryPush = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useHistory: () => ({
      push: mockHistoryPush
    })
  };
});

describe('DLSAppBar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (fullScreen = false, children: ReactNode = null, contextValue = mockContextValue) => {
    const history = createMemoryHistory();
    
    return render(
      <Router history={history}>
        <BeamlineTreeStateContext.Provider value={contextValue}>
          <DLSAppBar fullScreen={fullScreen}>
            {children}
          </DLSAppBar>
        </BeamlineTreeStateContext.Provider>
      </Router>
    );
  };

  it('renders the component correctly', () => {
    renderComponent();
    
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByLabelText('open settings')).toBeInTheDocument();
  });

  it('renders with children when provided', () => {
    const testChild = <div data-testid="test-child">Test Child</div>;
    renderComponent(false, testChild);
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('handles settings button click', () => {
    renderComponent();
    
    const settingsButton = screen.getByLabelText('open settings');
    fireEvent.click(settingsButton);
    // this is a placeholder test for when we actually have a settings menu
    expect(console.log).toHaveBeenCalledWith('TO DO - create settings modal');
  });

  it('renders all page navigation buttons from PageRouteInfo', () => {
    renderComponent();
    
    PageRouteInfo.forEach(page => {
      expect(screen.getByLabelText(page.ariaLabel)).toBeInTheDocument();
    });
  });

  it('navigates to the correct route when page button is clicked', () => {
    renderComponent();
    
    const firstPageButton = screen.getByLabelText(PageRouteInfo[0].ariaLabel);
    fireEvent.click(firstPageButton);
    
    expect(mockHistoryPush).toHaveBeenCalledWith(PageRouteInfo[0].route);
  });

  it('applies correct styling when fullScreen is true', () => {
    renderComponent(true);
    
    const appBar = screen.getByRole('banner');
    expect(appBar).toHaveAttribute('fullscreen', '1');
  });

  it('applies correct styling when fullScreen is false', () => {
    renderComponent(false);
    
    const appBar = screen.getByRole('banner');
    expect(appBar).toHaveAttribute('fullscreen', '0');
  });
});

describe('StyledAppBar Styled Component', () => {
    const theme = createTheme();
    
    const renderStyledComponent = (props: any) => {
      return render(
        <ThemeProvider theme={theme}>
          <StyledAppBar {...props}>
            <div>Test Content</div>
          </StyledAppBar>
        </ThemeProvider>
      );
    };
  
    it('applies default styling', () => {
      const { container } = renderStyledComponent({ fullscreen: 0 });
      const appBar = container.firstChild;
      
      expect(appBar).toHaveStyle(`width: calc(100% - 64px)`);
      expect(appBar).toHaveStyle(`z-index: ${theme.zIndex.drawer + 1}`);
    });
  
    it('applies styling when open and not fullscreen', () => {
      const { container } = renderStyledComponent({ open: true, fullscreen: 0 });
      const appBar = container.firstChild;
      
      expect(appBar).toHaveStyle(`margin-left: ${DRAWER_WIDTH}px`);
      expect(appBar).toHaveStyle(`width: calc(100% - ${DRAWER_WIDTH}px)`);
    });
  
    it('applies styling when closed and not fullscreen', () => {
      const { container } = renderStyledComponent({ open: false, fullscreen: 0 });
      const appBar = container.firstChild;
      
      expect(appBar).toHaveStyle(`margin-left: calc(${theme.spacing(7)} + 1px)`);
      expect(appBar).toHaveStyle(`width: calc(100% - ${theme.spacing(7)} - 8px)`);
    });
  
    it('applies fullscreen styling', () => {
      const { container } = renderStyledComponent({ fullscreen: 1 });
      const appBar = container.firstChild;
      
      expect(appBar).toHaveStyle(`width: 100%`);
    });
  });
