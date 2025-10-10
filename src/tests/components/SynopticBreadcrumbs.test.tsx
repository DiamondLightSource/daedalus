import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SynopticBreadcrumbs } from '../../components/SynopticBreadcrumbs';
import BeamlineTreeStateContext from '../../routes/MainPage';
import { FileContext, executeAction } from '@diamondlightsource/cs-web-lib';
import { BeamlineState, BeamlineStateProperties, BeamlineTreeState } from '../../store';

vi.mock('@diamondlightsource/cs-web-lib', async () => {
  const actual = await vi.importActual('@diamondlightsource/cs-web-lib');
  return {
    ...actual,
    executeAction: vi.fn()
  };
});

describe('SynopticBreadcrumbs Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockState = (screenId = 'Area1+Area2', beamline?: string): BeamlineTreeState => ({
    currentScreenId: screenId,
    currentBeamline: beamline,
    beamlines: !beamline ? {} : {
      [beamline]: {
        host: 'http://example.com/',
        filePathIds: {
          'Area1': { file: 'area1.opi' },
          'Area1+Area2': { file: 'area2.opi' }
        }
      } as unknown as BeamlineStateProperties
    } as unknown as BeamlineState,
    menuBarOpen: false
  } as unknown as BeamlineTreeState);

  const mockFileContext = {
    subscribeToConnectionState: vi.fn(),
    unsubscribeFromConnectionState: vi.fn(),
    pageState: {},
    tabState: {},
    addPage: vi.fn(), 
    removePage: vi.fn(),
    addTab: vi.fn(),
    removeTab: vi.fn(),
    selectTab: vi.fn()
  };

  const renderComponent = (state = createMockState(undefined, 'BL01')) => {
    return render(
      <BeamlineTreeStateContext.Provider value={{ state, dispatch: vi.fn() }}>
        <FileContext.Provider value={mockFileContext}>
          <SynopticBreadcrumbs />
        </FileContext.Provider>
      </BeamlineTreeStateContext.Provider>
    );
  };

  it('renders breadcrumbs correctly for a two-level path', () => {
    renderComponent();
    
    expect(screen.getByText('Area1')).toBeInTheDocument();
    expect(screen.getByText('Area2')).toBeInTheDocument();
    
    const link = screen.getByText('Area1');
    expect(link.tagName).toBe('A');
    
    const lastItem = screen.getByText('Area2');
    expect(lastItem.tagName).not.toBe('A');
  });

  it('renders breadcrumbs correctly for a single-level path', () => {
    renderComponent(createMockState('SingleArea', 'BL01'));
    
    expect(screen.getByText('SingleArea')).toBeInTheDocument();
    
    const item = screen.getByText('SingleArea');
    expect(item.tagName).not.toBe('A');
  });

  it('renders breadcrumbs with correct URLs', () => {
    renderComponent(createMockState('Area1+Area2+Area3', 'BL01'));
    
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/synoptic/BL01/Area1');
    expect(links[1]).toHaveAttribute('href', '/synoptic/BL01/Area1+Area2');
    
    expect(screen.getByText('Area3').tagName).not.toBe('A');
  });

  it('handles breadcrumb click correctly', () => {
    renderComponent();
    
    const link = screen.getByText('Area1');
    fireEvent.click(link);
    
    expect(executeAction).toHaveBeenCalledTimes(1);
    expect(executeAction).toHaveBeenCalledWith(
      {
        type: 'OPEN_PAGE',
        dynamicInfo: {
          name: 'http://example.com/area1.opi',
          location: 'main',
          description: undefined,
          file: {
            path: 'http://example.com/area1.opi',
            macros: {},
            defaultProtocol: 'ca'
          }
        }
      },
      mockFileContext,
      undefined,
      {},
      '/synoptic/BL01/Area1'
    );
  });

  it('does not call executeAction when clicking on non-link elements', () => {
    renderComponent();
    
    const breadcrumbsContainer = screen.getByLabelText('breadcrumb');
    fireEvent.click(breadcrumbsContainer);
    
    expect(executeAction).not.toHaveBeenCalled();
  });

  it('handles multi-level breadcrumb paths correctly', () => {
    renderComponent(createMockState('Level1+Level2+Level3+Level4', 'BL02'));
    
    expect(screen.getByText('Level1')).toBeInTheDocument();
    expect(screen.getByText('Level2')).toBeInTheDocument();
    expect(screen.getByText('Level3')).toBeInTheDocument();
    expect(screen.getByText('Level4')).toBeInTheDocument();
    
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(3);
    expect(links[0]).toHaveAttribute('href', '/synoptic/BL02/Level1');
    expect(links[1]).toHaveAttribute('href', '/synoptic/BL02/Level1+Level2');
    expect(links[2]).toHaveAttribute('href', '/synoptic/BL02/Level1+Level2+Level3');
  });

  it('applies correct styling to breadcrumbs container', () => {
    renderComponent();
    
    const breadcrumbsContainer = screen.getByLabelText('breadcrumb');
    expect(breadcrumbsContainer).toHaveStyle('margin-bottom: 10px');
    expect(breadcrumbsContainer).toHaveStyle('color: rgb(255, 255, 255)');
    expect(breadcrumbsContainer).toHaveStyle('display: flex');
    expect(breadcrumbsContainer).toHaveStyle('text-align: left');
  });

  it('renders NavigateNextIcon as separator', () => {
    renderComponent(createMockState('Area1+Area2+Area3', 'BL01'));
    
    const separators = document.querySelectorAll('svg');
    expect(separators.length).toBe(2);
  });
});