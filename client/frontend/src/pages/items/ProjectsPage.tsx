import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../auth/AuthContext";
import * as d3 from "d3";

type Project = {
  id: number;
  name: string;
  compt: string; 
  lang: string; 
  electronic_mail: string;
  username?: string;
  score?: number;
};

export default function ProjectsPage() {
  const auth = useContext(AuthContext);
  const [projects, setProjects] = useState<Project[]>([]);
  const [recommended, setRecommended] = useState<Project[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const width = 1000;
  const height = 700;

  const [name, setName] = useState("");
  const [newCompt, setNewCompt] = useState("");
  const [newLang, setNewLang] = useState("");
  const [comptTags, setComptTags] = useState<string[]>([]);
  const [langTags, setLangTags] = useState<string[]>([]);

  useEffect(() => {
    if (auth?.active) {
      fetchProjects();
      fetchRecommendations();
    }
  }, [auth]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/get_projects", { credentials: "include" });
      const data: Project[] = await res.json();
      setProjects(data);
    } catch (err) { console.error(err); }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await fetch("http://localhost:5000/recommend_projects", { credentials: "include" });
      const data: Project[] = await res.json();
      setRecommended(data);
    } catch (err) { console.error(err); }
  };

  const handleAddComptTag = () => {
    if (newCompt.trim() && !comptTags.includes(newCompt.trim())) {
      setComptTags([...comptTags, newCompt.trim()]);
      setNewCompt("");
    }
  };
  const handleAddLangTag = () => {
    if (newLang.trim() && !langTags.includes(newLang.trim())) {
      setLangTags([...langTags, newLang.trim()]);
      setNewLang("");
    }
  };
  const handleRemoveComptTag = (tag: string) => setComptTags(comptTags.filter((t) => t !== tag));
  const handleRemoveLangTag = (tag: string) => setLangTags(langTags.filter((t) => t !== tag));

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/add_project", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, compt: comptTags, lang: langTags }),
      });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      console.log(data.success_message);
      setName("");
      setComptTags([]);
      setLangTags([]);
      setNewCompt("");
      setNewLang("");
      fetchProjects();
      fetchRecommendations();
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (projects.length === 0 && recommended.length === 0) return;

    const allNodes = [...projects, ...recommended];

    // Links based on shared skills/languages
    const links: { source: number; target: number }[] = [];
    allNodes.forEach((a, i) => {
      allNodes.forEach((b, j) => {
        if (i < j) {
          const sharedSkills = a.compt.split(";").filter((s) => b.compt.split(";").includes(s));
          const sharedLangs = a.lang.split(";").filter((s) => b.lang.split(";").includes(s));
          if (sharedSkills.length + sharedLangs.length > 0) {
            links.push({ source: i, target: j });
          }
        }
      });
    });

    const simulation = d3.forceSimulation(allNodes as any)
      .force("link", d3.forceLink(links).distance(150).strength(0.08))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => {
        return 20 + (d.compt.split(";").length + d.lang.split(";").length) * 2;
      }))
      .force("skillCluster", d3.forceX((d: any) => {
        // Optional: push nodes with same main skill closer
        return width / 2;
      }).strength(0.03))
      .on("tick", ticked);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const link = svg.append("g")
      .attr("stroke", "#aaa")
      .attr("stroke-opacity", 0.4)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5);

    const colorScale = d3.scaleLinear<string>()
      .domain([0, d3.max(allNodes.map(n => n.score || 0)) || 1])
      .range(["#bbb", "#facc15"]); // Low score → gray, high score → yellow

    const node = svg.append("g")
      .selectAll("circle")
      .data(allNodes)
      .join("circle")
      .attr("r", d => 18 + (d.compt.split(";").length + d.lang.split(";").length))
      .attr("fill", d => colorScale(d.score || 0))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("filter", "drop-shadow(0px 4px 6px rgba(0,0,0,0.2))")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      );

    // Tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "absolute bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 rounded-xl shadow-2xl pointer-events-none opacity-0 transition-all duration-300 max-w-xs text-sm")
      .style("line-height", "1.4em");

    node.on("mouseover", (event, d: Project) => {
      d3.select(event.currentTarget)
        .transition().duration(200)
        .attr("r", 28 + (d.compt.split(";").length + d.lang.split(";").length))
        .style("filter", "drop-shadow(0px 10px 15px rgba(0,0,0,0.4))");

      tooltip.transition().duration(200).style("opacity", 1);
      tooltip.html(`
        <div class="font-bold text-lg mb-2">${d.name}</div>
        <div class="mb-1"><strong>Owner:</strong> ${d.username || d.electronic_mail}</div>
        <div class="flex flex-wrap gap-1 mb-1"><strong>Skills:</strong> ${d.compt.split(";").map(s => `<span class="px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-600 dark:text-indigo-100 rounded-full text-xs">${s.trim()}</span>`).join("")}</div>
        <div class="flex flex-wrap gap-1"><strong>Languages:</strong> ${d.lang.split(";").map(l => `<span class="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-600 dark:text-green-100 rounded-full text-xs">${l.trim()}</span>`).join("")}</div>
        ${d.score ? `<div class="text-yellow-500 font-semibold mt-1">Match Score: ${d.score}</div>` : ""}
      `);
    })
    .on("mousemove", (event) => {
      tooltip.style("left", event.pageX + 15 + "px").style("top", event.pageY + 15 + "px");
    })
    .on("mouseout", (event, d) => {
      d3.select(event.currentTarget)
        .transition().duration(200)
        .attr("r", 18 + (d.compt.split(";").length + d.lang.split(";").length))
        .style("filter", "drop-shadow(0px 4px 6px rgba(0,0,0,0.2))");
      tooltip.transition().duration(200).style("opacity", 0);
    });

    function ticked() {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
    }

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x; d.fy = d.y;
    }
    function dragged(event: any, d: any) { d.fx = event.x; d.fy = event.y; }
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null; d.fy = null;
    }

    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [projects, recommended]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <svg ref={svgRef} width={width} height={height} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl mb-8" />

      {/* Project Form */}
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-4">Add a New Project</h3>
        <form onSubmit={handleAddProject} className="space-y-4">
          <input type="text" placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-gray-200" />
          
          <div className="flex gap-2 flex-wrap mb-2">
            {comptTags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-600 dark:text-indigo-100 rounded-full text-sm cursor-pointer"
                onClick={() => handleRemoveComptTag(tag)}>{tag} &times;</span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Add skill" value={newCompt} onChange={(e) => setNewCompt(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-gray-200" />
            <button type="button" onClick={handleAddComptTag}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add</button>
          </div>

          <div className="flex gap-2 flex-wrap mb-2">
            {langTags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-600 dark:text-green-100 rounded-full text-sm cursor-pointer"
                onClick={() => handleRemoveLangTag(tag)}>{tag} &times;</span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Add language" value={newLang} onChange={(e) => setNewLang(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-gray-200" />
            <button type="button" onClick={handleAddLangTag}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Add</button>
          </div>

          <button type="submit" className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow">Create Project</button>
        </form>
      </div>
    </div>
  );
}
