import React, { useMemo, useState } from 'react'
import Graph, {getSeed} from "react-graph-vis";

const MyGraph = ({data, rootElement}) => {

    const options = {
        layout: {
          hierarchical: {
            enabled: false,
            // nodeSpacing: 400,
            // levelSeparation: 400,
            // parentCentralization: true,
            // blockShifting: true,
            // improvedLayout: false
          },
          randomSeed: 2

        },
        edges: {
            color: "#fff",
            width: 2,
            length: 400,  
            font: {
                align: 'middle',
                size: 18,
                background: '#29292E',
                color: '#fff'
            },
            widthConstraint: {
                maximum: 200
            },
          
        },
        nodes: {
            shape: 'circle',
            widthConstraint: {
                minimum: 100,
                maximum: 200
            },
            font: {
                align: 'center',
                size: 24,
                color: '#fff'
            },
            color: '#1CAE84',
            
        },
        interaction: {
            dragNodes: false
        },
        physics: {
          enabled: true,
          barnesHut: {
            centralGravity: 0,
            gravitationalConstant: -50000,
          },         
        },
        height: '100%',
        width: '100%',
      };

     
      const getNodesList = (data) => {
        const objectList = data.map(el => {
            return el.object
        })

        const dependentObjectsList = data.map(el => {
            return el.dependentObject
        })

        const nodes = Array.from(new Set(objectList.concat(dependentObjectsList)))
        
        return nodes.map((el, index) => {
            return { id: el, label: el }
        })
      }

      /* Логика:  1. фильтруем дату на наличие ключевого элемента,
         получаем список зависимых элементов, если он есть, для каждого зависимого
        повторяем процедуру, если нет передаем управление
      */


      const createGraphData = (data, rootElement) => {
        const dependent = data.filter(el => el.object === rootElement && el.object !== el.dependentObject )
        const nodes_list = []
        dependent.forEach(el=>{
          nodes_list.push(...createGraphData(data, el.dependentObject))
          return nodes_list
        })
        nodes_list.push(...dependent)
        return nodes_list
      }

      const getEdgesList = (data) => {
        return data.map((el) => {
            return {
                from: el.object, to: el.dependentObject, label: el.linkType
            }
        })
      }

      const [graph, setGraph] = useState({})
      

      const graphData = createGraphData(data, rootElement)
      const nodes = getNodesList(graphData) 
      const edges = getEdgesList(graphData)
      useMemo(() => setGraph({

        nodes: nodes,
        edges: edges
      }
      ), [])


        return (
    <div style={{background: '#29292E', width: '100%', height: '100%'}}>
         <Graph
      graph={graph}
      options={options}
    />
    </div>
  )
}

export default MyGraph