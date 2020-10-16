import React from 'react';
import './Filter.css';
import { StateContext } from '../../StateProvider';

class CheckBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = { checked: false };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
        this.props.callback({ active: !this.state.checked, option: this.props.option });

        this.setState({ checked: !this.state.checked });
    }

    render() {
        return (
            <div className="checkbox">
                <input type="checkbox" onChange={this.handleChange} checked={this.state.checked} />
                <laber>{this.props.option}</laber>
            </div>
        );
    }
}

class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.updateFilter = this.updateFilter.bind(this);
    }

    static contextType = StateContext;

    updateFilter(filter) {
        if (filter.active) {
            /*this.context[1]({
                type: 'ADD_FILTER',
                filter: { [this.props.title]: filter.option }
            });*/
        } else {
            //alert('not active');
        }

        let obj = {};
        obj[this.props.title] = filter.option;

        this.props.callback(obj);
    }

    render() {
        return (
            <div className="filter">
                <div className="filter__title">{this.props.title}</div>
                <div className="filter__content">
                    {this.props.options.map(e => <CheckBox callback={this.updateFilter} option={e} />)}
                </div>
            </div>
        );
    }
}

export default Filter;