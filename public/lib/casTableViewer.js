/*
 * ------------------------------------------------------------------------------------
 *   Copyright (c) SAS Institute Inc.
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 * ---------------------------------------------------------------------------------------
 *
 */
 'use strict';
 function  Table(props) {
    let {data} = props; 
    let theadRows =  data.get('schema').map(s => {
        let name = s.get('name');
        if ( name !== '_Index_') {
           return <th scope="col" style={{backgroundColor: 'lightgrey'}} >{name}</th>
        }
    });
    let thead = <thead> {theadRows} </thead>;

    let tbodyRows = data.get('rows').map(row => {
        let thisRow = <tr>
        { 
            row.map((col, index)=> {
                if ( index > 0 ) {
                    let v = <input type="text"  value={col}/>
                    return ( <td> {v} </td>) 
                }
                })
            }
            </tr>;
        return thisRow;
        })
    let tbody = <tbody>  {tbodyRows}   </tbody>;
        

    return (
        <div>
        <table class="table table-striped">
            {thead}
            {tbody}
        </table>
        </div>
    )
}

class TableViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data      : props.data,
            title     : props.title
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({data: nextProps.data, title: nextProps.title });
    }
    render() {
        return (
            <div>
            <Table data={this.state.data}  title={this.state.title}  />
            </div>
        );
    }
}
function casTableViewer (result, tableName, title, container) {
    let data = result.items('tables', tableName);
    ReactDOM.render(<TableViewer data={data}  title={title} />,
        document.querySelector(container));
    return true;
    }